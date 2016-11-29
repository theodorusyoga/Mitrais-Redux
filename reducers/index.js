import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import pictures from './instareducer'
import picdetails from './instadetails'
import comments from './instacomments'
import comment from './commentedit'
import login from './validation'

const reducers = combineReducers({
  pictures,
  picdetails,
  comments,
  comment,
  login,
  routing: routerReducer
})

export default reducers