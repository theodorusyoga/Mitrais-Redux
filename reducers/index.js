import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import pictures from './instareducer';
import picdetails from './instadetails';
import comments from './instacomments';
import editcomment from './commentedit';
import login from './validation';

const reducers = combineReducers({
    pictures,
    picdetails,
    comments,
    editcomment,
    login,
    routing: routerReducer
});

export default reducers;
