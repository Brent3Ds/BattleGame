import { SET_HEALTH } from "../actions/types"

const initialState = {
    health: 1000
}

export default function(state = initialState, action, payload){
    switch(action.type){
        case SET_HEALTH:
            return {...state, health: action.payload}
        default:
            return state
    }
}