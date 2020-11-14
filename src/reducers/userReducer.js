import { REGISTERED, GET_STORES, LOGGED, GET_MOVIMIENTOS } from '../constants'

const initialState = {
    user: {},
    events: []
}

export function useReducer(state = initialState, { type, payload }) {

    switch (type) {

        case REGISTERED:
            return
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
        case GET_MOVIMIENTOS:
            return
        case 'SET_STORE':
            return

    }



    return state;
}
