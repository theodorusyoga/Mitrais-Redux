import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import emps from './emp'
import empcounter from './empcounter'
import append from './append'
import detail from './detail'
import pictures from './instareducer'

const empreducer = combineReducers({
  emps,
  empcounter,
  append,
  detail,
  pictures,
  routing: routerReducer
})


export default empreducer