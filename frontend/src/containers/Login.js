import React from 'react';
import axios from 'axios'
import Spinner from "../components/UI/Spinner/Spinner";
import {connect} from 'react-redux';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../store/actions/index';
import FormComponent from "../hoc/Form/Form";
import {Redirect} from "react-router-dom";

class Login extends FormComponent {
    state = {
        formButtonText:'LOGIN',
        form: {
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

    formSubmitHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const formData = {};
        for (let formElementIdentifier in this.state.form) {
            formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
        }
        this.props.onAuth(formData, false);
    };

    render() {
        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to='/myLists'/>
        }
        let form = this.defaultForm();
        if (this.state.loading) {
            form = <Spinner/>;
        }
        return (
            <div>
                <h4>Login Now</h4>
                {authRedirect}
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (authData, isSignup) => dispatch(actions.auth(authData, isSignup)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Login, axios));


