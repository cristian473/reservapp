import { LOGGED, SET_MEMBER_FORM_DATA } from '../constants'

const initialState = {
    user: {
        type: ''
    },
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
    }
    return state;
}
