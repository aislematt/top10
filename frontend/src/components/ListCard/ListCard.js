import React from 'react';
import {Link} from "react-router-dom";

const listCard = (props) => {
  return (
      <Link to={"/list/" + props.list.id}>{props.list.name}</Link>
  )
};

export default listCard;