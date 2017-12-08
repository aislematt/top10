import React from 'react';
import axios from 'axios'
import Spinner from "../../components/UI/Spinner/Spinner";
import {connect} from 'react-redux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import FormComponent from "../../hoc/Form/Form";

class CreateList extends FormComponent {
    state = {
        form: {
            list_name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'List Name'
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
        loading: false
    };

    createListHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const formData = {};
        for (let formElementIdentifier in this.state.form) {
            formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
        }
        const data = {
            "name": formData["list_name"]
        };
        axios.post('/list', data)
            .then(response => {
                console.log(response);
                this.props.listAdded(response.data.list);
                this.props.history.push('/editList')
            })
            .catch(err => {
                // dispatch(authFail(err.response.data.error));
            });
    };

    render() {
        const formElementsArray = [];
        for (let key in this.state.form) {
            formElementsArray.push({
                id: key,
                config: this.state.form[key]
            });
        }
        let form = (
            <form onSubmit={this.createListHandler}>
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
                <Button btnType="Success" disabled={!this.state.formIsValid}>CREATE LIST</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner/>;
        }
        return (
            <div>
                <h4>Create List</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
}

const mapDispatchToProps = dispatch => {
    return {
        listAdded: (list) => dispatch(actions.listAdded(list)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(CreateList, axios));


