import React, {Component} from 'react';
import './App.css';
import Layout from './hoc/Layout/Layout'
import ListBuilder from './containers/ListBuilder/ListBuilder'
import {Redirect, Route, Switch} from 'react-router-dom';
import SingleList from "./containers/SingleList";
import Signup from "./containers/Signup";
import withRouter from "react-router-dom/es/withRouter";
import * as actions from "./store/actions";
import {connect} from "react-redux";
import Login from "./containers/Login";
import MyLists from "./containers/MyLists";


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
    }

    componentDidMount () {
        this.props.onTryAutoSignup();
        this.setState({authenticationChecked : true});

    }
    render() {
        console.log("ISAUTHENTICATED", this.props.isAuthenticated)
        if (this.state.authenticationChecked) {

            return (
                <div className="App">
                    <Layout>
                        <Route path="/" exact component={ListBuilder}/>
                        <Route path="/list/:id" exact component={SingleList}/>
                        <Route path="/signup" exact component={Signup}/>
                        <Route path="/login" exact component={Login}/>
                        <PrivateRoute path="/myLists" authed={this.props.isAuthenticated} exact component={MyLists}/>
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
