import * as actionTypes from './actionTypes';


export const listAdded = (list) => {
    return {
        type: actionTypes.LIST_ADDED,
        list: list
    };
};
