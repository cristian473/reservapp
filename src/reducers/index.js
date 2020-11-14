import { combineReducers } from 'redux'
// import { getData } from './productosReducers'
import { useReducer } from './userReducer'
// import { ventasReducer } from './ventasReducer'

export const reducers = combineReducers({
    user: useReducer
})