import Columns from "react-columns"

import React from 'react';
import ListCard from "../ListCard/ListCard";

const listCards = (props) => {
    const displayLists = props.lists.map(aList => {
        return <ListCard key={aList.id} list={aList}/>
    });

    return (
        <Columns columns="2">
            {displayLists}
        </Columns>

    )
};

export default listCards;