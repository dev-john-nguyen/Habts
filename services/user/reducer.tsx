import { FETCHED, SET_USER, INITIALIZE_USER, SET_NOTIFICATION_TOKEN, SIGN_OUT } from "./actionTypes";

const INITIAL_STATE = {
    uid: '',
    fetched: false,
    initializeUser: false,
    notificationToken: ''
}

export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case FETCHED:
            return {
                ...state,
                fetched: true
            }
        case INITIALIZE_USER:
            return {
                ...state,
                initializeUser: true,
                initializeUserData: action.payload
            }
        case SET_USER:
            return {
                ...state,
                ...action.payload,
                fetched: true,
                initializeUser: false,
                initializeUserData: null
            }
        case SET_NOTIFICATION_TOKEN:
            return {
                ...state,
                notificationToken: action.payload
            }
        case SIGN_OUT:
            return { ...INITIAL_STATE, fetched: true };
        default:
            return state;
    }
}