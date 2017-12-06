import React, {Component} from 'react';
import axios from 'axios'
import Spinner from "../components/UI/Spinner/Spinner";
import {connect} from 'react-redux';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../store/actions/index';
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";

class Login extends Component {
    state = {
        loginForm: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'password'
                },
                value: '',
                validation: {
                    required: true,
                    isPassword: true
                },
                valid: false,
                touched: false
            },
        },
        formIsValid: false,
        loading: false
    };

    loginHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const formData = {};
        for (let formElementIdentifier in this.state.loginForm) {
            formData[formElementIdentifier] = this.state.loginForm[formElementIdentifier].value;
        }
        this.props.onAuth(formData, false);
    };

    checkValidity(value, rules) {
        return true
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedLoginForm = {
            ...this.state.loginForm
        };
        const updatedFormElement = {
            ...updatedLoginForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedLoginForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedLoginForm) {
            formIsValid = updatedLoginForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({loginForm: updatedLoginForm, formIsValid: formIsValid});
    };

    render() {
        const formElementsArray = [];
        for (let key in this.state.loginForm) {
            formElementsArray.push({
                id: key,
                config: this.state.loginForm[key]
            });
        }
        let form = (
            <form onSubmit={this.loginHandler}>
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
                <Button btnType="Success" disabled={!this.state.formIsValid}>LOGIN</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner/>;
        }
        return (
            <div>
                <h4>Login Now</h4>
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
        onAuth: (authData, isSignup) => dispatch(actions.auth(authData, isSignup)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Login, axios));


