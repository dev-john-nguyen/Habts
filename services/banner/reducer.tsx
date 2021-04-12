import { SET_BANNER, REMOVE_BANNER } from "./actionTypes"

const INITIAL_STATE = {
    type: '',
    message: ''
}

export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case SET_BANNER:
            return action.payload;
        case REMOVE_BANNER:
            return INITIAL_STATE;
        default:
            return state;
    }
}