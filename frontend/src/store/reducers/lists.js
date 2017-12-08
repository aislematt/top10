import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    list: null,
    error: null,
    loading: false,
};


const listAdded = (state, action) => {
    return updateObject( state, {
        list: action.list,
        error: null,
        loading: false
    } );
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.LIST_ADDED: return listAdded(state, action);
        default:
            return state;
    }
};

export default reducer;