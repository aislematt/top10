import React from 'react';

const listItem = (props) => {
    return (
        <div>
            {props.item.rank}
            <h1>{props.item.name}</h1>
            <img alt={props.item.name} src={props.item.image}/>
            <p>{props.item.body}</p>


        </div>
    )
};

export default listItem;