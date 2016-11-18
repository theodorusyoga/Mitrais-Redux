import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import emps from './emp'
import empcounter from './empcounter'
import append from './append'
import detail from './detail'
import pictures from './instareducer'
import picdetails from './instadetails'
import comments from './instacomments'

const empreducer = combineReducers({
  emps,
  empcounter,
  append,
  detail,
  pictures,
  picdetails,
  comments,
  routing: routerReducer
})


export default empreducer