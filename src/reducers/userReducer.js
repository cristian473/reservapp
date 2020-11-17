import { REGISTERED, GET_STORES, LOGGED, GET_MOVIMIENTOS } from '../constants'

const initialState = {
    user: {},
    events: [],
    eventInfo: {},
    integrants: [],
    myReserves: []
}

export function useReducer(state = initialState, { type, payload }) {

    switch (type) {

        case LOGGED:
            return {
                ...state,
                user: payload
            }
        case 'GET_EVENTS':
            return {
                ...state,
                events: payload
            }
        case 'GET_EVENTINFO':
            return {
                ...state,
                eventInfo: payload
            }
        case 'CLEAN_STATE':
            localStorage.removeItem('u_data')
            return {
                ...state,
                user: {}
            }
        case 'SET_INTEGRANTS':
            return {
                ...state,
                integrants: payload
            }
        case 'SET_RESERVES':
            return {
                ...state,
                myReserves: payload
            }
    }



    return state;
}
