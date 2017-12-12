import React from 'react'
import NavigationItem from './NavigationItem/NavigationItem'
import classes from './NavigationItems.css'

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        {props.isAuthenticated ? <NavigationItem link="/myLists" active>My Lists</NavigationItem> : null}
        {props.isAuthenticated ? <NavigationItem link="/createList" active>Create New List</NavigationItem> : null}
        {props.isAuthenticated ? <NavigationItem link="/logout" active>Logout</NavigationItem> : null}

        {!props.isAuthenticated ? <NavigationItem link="/login" active>Login</NavigationItem> : null}
        {!props.isAuthenticated ? <NavigationItem link="/createAccount" active>Create Account</NavigationItem> : null}


    </ul>
);

export default navigationItems