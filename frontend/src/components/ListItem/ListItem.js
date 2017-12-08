import React from 'react';

import classes from './ListItem.css'

const listItem = (props) => {
    let img = null;
    if (props.item.image) {
        img = <img alt={props.item.name} src={props.item.image}/>
    }
    return (
        <div className={classes.ListItem}>
            <h2>{props.item.rank}. {props.item.name}</h2>
            {img}
            <p>{props.item.body}</p>


        </div>
    )
};

export default listItem;