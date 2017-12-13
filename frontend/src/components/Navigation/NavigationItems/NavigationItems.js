import React from 'react'
import NavigationItem from './NavigationItem/NavigationItem'

const navigationItems = (props) => {
    return (
        <ul className="nav navbar-nav">
            {props.isAuthenticated ? <NavigationItem link="/myLists" active>My Lists</NavigationItem> : null}
            {props.isAuthenticated ? <NavigationItem link="/createList">Create New List</NavigationItem> : null}
            {props.isAuthenticated ? <NavigationItem link="/logout">Logout</NavigationItem> : null}

            {!props.isAuthenticated ? <NavigationItem link="/login">Login</NavigationItem> : null}
            {!props.isAuthenticated ? <NavigationItem link="/signup">Create Account</NavigationItem> : null}


        </ul>
    );
};

export default navigationItems