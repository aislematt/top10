import React from 'react';
import axios from 'axios'
import Spinner from "../../components/UI/Spinner/Spinner";
import {connect} from 'react-redux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import FormComponent from "../../hoc/Form/Form";
import ListItem from "../../components/ListItem/ListItem";
import List from "../../components/List/List";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

const grid = 8;
const getItemStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
});
const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 500,
});

class EditList extends FormComponent {
    state = {
        ...this.state,
        form: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            body: {
                elementType: 'textarea',
                elementConfig: {
                    type: 'text',
                    placeholder: 'body'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            }
        },

        formIsValid: false,
        loading: false,
        addingItem: false,
        editingItem: false,
        currentItem: null,
        formButtonText: "ADD ITEM"
    };

    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        this.state.list.list_items = this.reorder(
            this.state.list.list_items,
            result.source.index,
            result.destination.index
        );

        const itemsIdsRanked = [];
        for (let item in this.state.list.list_items) {
            itemsIdsRanked.push(this.state.list.list_items[item].id);
        }

        axios.post('/reorderList', {'list_id': this.state.list.id, 'itemIdsRanked': itemsIdsRanked})
            .then(response => {
                this.setState({
                    list: response.data.list,
                    loading: false,
                    addingItem: false,
                    editingItem: false,
                    currentItem: null
                })

            })
            .catch(err => {
                this.setState({loading: false})
            });

    };

    addItemHandler = (event) => {
        this.setState({addingItem: true, formButtonText:'ADD ITEM'})
    };

    editItemHandler = (currentItem, event) => {
        this.setState({editingItem: true, currentItem: currentItem,formButtonText:'EDIT ITEM'});
        for (let formElementIdentifier in this.state.form) {
            this.state.form[formElementIdentifier].value = currentItem[formElementIdentifier];
        }
    };

    formSubmitHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const formData = {};
        for (let formElementIdentifier in this.state.form) {
            formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
        }
        let method = "post";
        formData["list_id"] = this.state.list.id;
        if (this.state.editingItem) {
            formData["list_item_id"] = this.state.currentItem.id;
            method = 'patch';
        }


        axios.request({url: '/listItem', data: formData, method: method})
            .then(response => {
                this.setState({
                    list: response.data.list,
                    loading: false,
                    addingItem: false,
                    editingItem: false,
                    currentItem: null
                })

            })
            .catch(err => {
                this.setState({loading: false})
            });
    };

    componentDidMount() {
        if (this.props.list) {
            this.setState({list: this.props.list})
        }
        if (!this.props.list && this.props.match.params.listId) {
            this.state.loading = true;
            axios.get("/list/" + this.props.match.params.listId)
                .then(response => {
                        this.setState({list: response.data.list, loading: false});
                    }
                )
        }

    }

    render() {
        let display = [];
        if (!this.state.addingItem && !this.state.editingItem) {
            if (this.state.list) {
                display.push(<List key="list" list={this.state.list} hideListItems={true}/>);

                if (this.state.list.list_items) {
                    display.push(<DragDropContext key="items" onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    {this.state.list.list_items.map(item => (
                                        <Draggable key={item.id} draggableId={item.id}>
                                            {(provided, snapshot) => (
                                                <div>
                                                    <div
                                                        ref={provided.innerRef}
                                                        style={getItemStyle(
                                                            provided.draggableStyle,
                                                            snapshot.isDragging
                                                        )}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Button btnType="Success" clicked={() => this.editItemHandler(item)}>Edit Item</Button>

                                                        <ListItem item={item}/>
                                                    </div>
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>);
                }
                display.push(<Button key="add" btnType="Success" clicked={this.addItemHandler}>ADD ITEM</Button>)
            }
            else {
                display = <Spinner/>
            }
        } else {


            const formElementsArray = [];
            for (let key in this.state.form) {
                formElementsArray.push({
                    id: key,
                    config: this.state.form[key]
                });
            }
            let form = this.defaultForm();
            if (this.state.loading) {
                form = <Spinner/>;
            }
            display = (
                <div>
                    <h4>Add Item</h4>
                    {form}
                </div>
            );
        }
        return (
            <div>
                {display}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        list: state.lists.list
    };
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(EditList, axios));

