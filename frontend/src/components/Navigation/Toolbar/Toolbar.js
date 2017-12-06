import React from 'react'
import classes from './Toolbar.css'
import NavigationItems from '../../Navigation/NavigationItems/NavigationItems'
import DrawerToggle from '../DrawerToggle/DrawerToggle'

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <DrawerToggle clicked={props.drawerToggleClicked}/>
        <nav className={classes.DesktopOnly}>
            <NavigationItems/>
        </nav>
    </header>
);

export default toolbar;