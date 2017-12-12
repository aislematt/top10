import React from 'react';
import axios from 'axios'
import Spinner from "../../components/UI/Spinner/Spinner";
import {connect} from 'react-redux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Button from "../../components/UI/Button/Button";
import FormComponent from "../../hoc/Form/Form";
import ListItem from "../../components/ListItem/ListItem";
import List from "../../components/List/List";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import classes from './EditList.css'
import Input from "../../components/UI/Input/Input";

const grid = 8;
const getItemStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'lightgrey',

    // styles we need to apply on draggables
    ...draggableStyle,
});
const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'white',
    padding: grid
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
            },
            yt_video: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'video url'
                },
                value: '',
                validation: {
                    required: false
                },
                valid: false,
                touched: false
            }
        },
        listForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'name'
                },
                label: 'List Name',
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            image: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'image url'
                },
                value: '',
                validation: {
                    required: false
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
        this.setState({addingItem: true, formButtonText: 'ADD ITEM'})
    };

    editItemHandler = (currentItem, event) => {
        this.setState({editingItem: true, currentItem: currentItem, formButtonText: 'EDIT ITEM'});
        for (let formElementIdentifier in this.state.form) {
            this.state.form[formElementIdentifier].value = currentItem[formElementIdentifier];
        }
    };

    listFormSubmitHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const formData = {};
        for (let formElementIdentifier in this.state.listForm) {
            formData[formElementIdentifier] = this.state.listForm[formElementIdentifier].value;
        }
        formData["list_id"] = this.state.list.id;


        axios.patch('/list', formData)
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
            this.setState({list: this.props.list});
            for (let formElementIdentifier in this.state.listForm) {
                this.state.listForm[formElementIdentifier].value = this.props.list[formElementIdentifier];
            }
        }
        if (!this.props.list && this.props.match.params.listId) {
            this.state.loading = true;
            axios.get("/list/" + this.props.match.params.listId)
                .then(response => {
                        for (let formElementIdentifier in this.state.listForm) {
                            this.state.listForm[formElementIdentifier].value = response.data.list[formElementIdentifier];
                        }
                        this.setState({list: response.data.list, loading: false});

                    }
                )
        }

    }

    listInputChangedHandler = (event, inputIdentifier) => {
        const updatedForm = {
            ...this.state.listForm
        };
        const updatedFormElement = {
            ...updatedForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedForm) {
            formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({listForm: updatedForm, formIsValid: formIsValid});
    };

    render() {
        let display = null;
        if (!this.state.addingItem && !this.state.editingItem) {
            if (this.state.list) {
                let listItems = null;
                if (this.state.list.list_items) {
                    listItems = (<DragDropContext key="items" onDragEnd={this.onDragEnd}>
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
                                                        <Button btnType="Success"
                                                                clicked={() => this.editItemHandler(item)}>Edit
                                                            Item</Button>

                                                        <ListItem item={item} hideVideo='true'/>
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

                const formElementsArray = [];
                for (let key in this.state.listForm) {
                    formElementsArray.push({
                        id: key,
                        config: this.state.listForm[key]
                    });
                }

                let form = (
                    <form onSubmit={this.listFormSubmitHandler}>
                        {formElementsArray.map(formElement => (
                            <Input
                                key={formElement.id}
                                label={formElement.config.label}
                                elementType={formElement.config.elementType}
                                elementConfig={formElement.config.elementConfig}
                                value={formElement.config.value}
                                invalid={!formElement.config.valid}
                                shouldValidate={formElement.config.validation}
                                touched={formElement.config.touched}
                                changed={(event) => this.listInputChangedHandler(event, formElement.id)}/>
                        ))}
                        <Button btnType="Success" disabled={!this.state.formIsValid}>SAVE</Button>
                    </form>
                );


                display = (
                    <div className={classes.EditList}>
                        {form}
                        {listItems}
                        <Button key="add" btnType="Success" clicked={this.addItemHandler}>ADD ITEM</Button>
                    </div>
                );
            }
            else {
                display = <Spinner/>
            }
        } else {
            let form = this.defaultForm();
            if (this.state.loading) {
                form = <Spinner/>;
            }
            display = (
                <div className={classes.EditList}>
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

