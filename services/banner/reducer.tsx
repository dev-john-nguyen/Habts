import { SET_BANNER, REMOVE_BANNER, REMOVE_CONGRATS_BANNER, SET_CONGRATS_BANNER } from "./actionTypes"

const INITIAL_STATE = {
    type: '',
    message: '',
    congratsBanner: {
        goalIndex: undefined,
        headerText: undefined
    }
}

export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case SET_BANNER:
            return {
                ...INITIAL_STATE,
                ...action.payload
            }
        case REMOVE_BANNER:
            return INITIAL_STATE;
        case REMOVE_CONGRATS_BANNER:
            return INITIAL_STATE;
        case SET_CONGRATS_BANNER:
            return {
                ...INITIAL_STATE,
                congratsBanner: { ...action.payload }
            }
        default:
            return state;
    }
}