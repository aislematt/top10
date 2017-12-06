import React from 'react';
import ListItem from '../ListItem/ListItem'


const list = (props) => {
    const listItems = props.list.list_items.map(listItem => {
        return (
            <ListItem key={listItem.id} item={listItem}></ListItem>
        )
    });
    return (
        <div>

            <h1>{props.list.name}</h1>
            <p>{props.list.author} | {props.list.date}</p>
            <p>{props.list.description}</p>
            <div>
                {listItems}
            </div>

        </div>
    )
};

export default list;