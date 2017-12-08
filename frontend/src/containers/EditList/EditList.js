import React from 'react';
import axios from 'axios'
import Spinner from "../../components/UI/Spinner/Spinner";
import {connect} from 'react-redux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import FormComponent from "../../hoc/Form/Form";
import ListItem from "../../components/ListItem/ListItem";
import List from "../../components/List/List";

class EditList extends FormComponent {
    state = {
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
        currentItem: null
    };

    addItemHandler = (event) => {
        this.setState({addingItem: true})
    };

    editItemHandler = (currentItem, event) => {
        this.setState({editingItem: true, currentItem:currentItem})
        for (let formElementIdentifier in this.state.form) {
            this.state.form[formElementIdentifier].value = currentItem[formElementIdentifier];
        }
    };

    saveItemHandler = (event) => {
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
                this.setState({list: response.data.list, loading: false, addingItem: false, editingItem: false, currentItem: null})

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
                    display = display.concat(this.state.list.list_items.map(item => {
                        return (
                            <div key={item.id}>
                                <Button btnType="Success" clicked={() => this.editItemHandler(item)}>Edit Item</Button>
                                <ListItem item={item}/>
                            </div>
                        )
                    }));
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
            let buttonText = "ADD ITEM";
            if (this.state.editingItem) {
                buttonText = "EDIT ITEM";
            }
            let form = (
                <form onSubmit={this.saveItemHandler}>
                    {formElementsArray.map(formElement => (
                        <Input
                            key={formElement.id}
                            elementType={formElement.config.elementType}
                            elementConfig={formElement.config.elementConfig}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
                    ))}
                    <Button btnType="Success" disabled={!this.state.formIsValid}>{buttonText}</Button>
                </form>
            );
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

