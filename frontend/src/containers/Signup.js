import React from 'react';
import axios from 'axios'
import Spinner from "../components/UI/Spinner/Spinner";
import {connect} from 'react-redux';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../store/actions/index';
import FormComponent from "../hoc/Form/Form";

class Signup extends FormComponent {
    state = {
        ...this.state,
        form: {
            first_name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'First Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            last_name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Last Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
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

    signupHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const formData = {};
        for (let formElementIdentifier in this.state.form) {
            formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
        }
        this.props.onAuth(formData, true);
    };

    render() {
        let form = this.defaultForm();
        if (this.state.loading) {
            form = <Spinner/>;
        }
        return (
            <div>
                <h4>Signup Now</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (authData, isSignup) => dispatch(actions.auth(authData, isSignup)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Signup, axios));


