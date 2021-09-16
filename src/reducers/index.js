import { combineReducers } from 'redux'
import { useReducer } from './userReducer'

export const reducers = combineReducers({
    user: useReducer,
})