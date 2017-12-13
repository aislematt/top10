import React from 'react';
import {Link} from "react-router-dom";
import moment from "moment/moment";
import classes from './ListCard.css'

const listCard = (props) => {
    let createdAt = moment(props.list.created_at).format("MMMM D, Y");

    return (
        <Link className={classes.ListCard} to={"/list/" + props.list.id}>
            <article>
                <img alt="" className={classes.mainImage} src={props.list.image}/>
                <h3>{props.list.name}</h3>
                <p>{props.list.user_name} | {createdAt}</p>
            </article>

        </Link>
    )
};

export default listCard;