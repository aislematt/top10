import React from 'react'
import classes from './Toolbar.css'
import NavigationItems from '../../Navigation/NavigationItems/NavigationItems'
import {Link} from "react-router-dom";

const toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link className="navbar-brand" to="/">Top 10 Lists</Link>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <NavigationItems isAuthenticated={props.isAuthenticated}/>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default toolbar;