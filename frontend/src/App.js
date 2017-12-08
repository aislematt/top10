import React, {Component} from 'react';
import './App.css';
import Layout from './hoc/Layout/Layout'
import ListBuilder from './containers/UserProfile/UserProfile'
import {Redirect, Route} from 'react-router-dom';
import SingleList from "./containers/SingleList";
import Signup from "./containers/Signup";
import withRouter from "react-router-dom/es/withRouter";
import * as actions from "./store/actions";
import {connect} from "react-redux";
import Login from "./containers/Login";
import MyLists from "./containers/MyLists";
import CreateList from "./containers/CreateList/CreateList";
import EditList from "./containers/EditList/EditList";


function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props} />
                : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
        />
    )
}

class App extends Component {

    state = {
        authenticationChecked : false
    };

    componentDidMount () {
        this.props.onTryAutoSignup();
        this.setState({authenticationChecked : true});

    }
    render() {
        if (this.state.authenticationChecked) {

            return (
                <div className="App">
                    <Layout>
                        <Route path="/list/:id" exact component={SingleList}/>
                        <Route path="/signup" exact component={Signup}/>
                        <Route path="/login" exact component={Login}/>
                        <Route path="/user/:id" exact component={ListBuilder}/>
                        <PrivateRoute path="/myLists" authed={this.props.isAuthenticated} exact component={MyLists}/>
                        <PrivateRoute path="/createList" authed={this.props.isAuthenticated} exact component={CreateList}/>
                        <PrivateRoute path="/editList/:listId?" authed={this.props.isAuthenticated} component={EditList}/>

                    </Layout>
                </div>
            );
        } else {
            return (
                <div className="App">
                </div>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        token: state.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch( actions.authCheckState() )
    };
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );
