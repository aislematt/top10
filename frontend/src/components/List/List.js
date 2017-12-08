import  React from 'react';
import ListItem from '../ListItem/ListItem'
import moment from "moment";
import classes from './List.css'
import {Link} from "react-router-dom";


const list = (props) => {
    let listItems = null;
    if (!props.hideListItems) {
            listItems = props.list.list_items.map(listItem => {
            return (
                <ListItem key={listItem.id} item={listItem}/>
            )
        });
    }
    let createdAt = moment(props.list.created_at).format("MMMM D, Y");


    return (
        <div>

            <h1>{props.list.name}</h1>
            <p>By <Link to={"/lists/" + props.list.user_id}>{props.list.user_name}</Link> | <span className={classes.CreatedAt}>{createdAt}</span></p>
            <p>{props.list.description}</p>
            <div>
                {listItems}
            </div>

        </div>
    )
};

export default list;