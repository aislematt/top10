import React from 'react';

import classes from './ListItem.css'
import YouTube from 'react-youtube'

const listItem = (props) => {
    let img = null;
    if (props.item.image && !props.item.yt_video) {
        img = <img alt={props.item.name} src={props.item.image}/>
    }
    let video = null;
    if (props.item.yt_video && !props.hideVideo) {
        const opts = {
            height: '300',
            width: '600',
            playerVars: {
                start: props.item.yt_ts
            }
        };
        video = <YouTube
            videoId={props.item.yt_id}
            opts={opts}
        />
    }

    return (
        <div className={classes.ListItem}>
            <h2>{props.item.rank}. {props.item.name}</h2>
            {img}
            {video}
            <p>{props.item.body}</p>

        </div>
    )
};

export default listItem;