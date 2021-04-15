import { FETCHED, SET_USER, INITIALIZE_USER, SET_NOTIFICATION_TOKEN, SIGN_OUT, PURCHASE_ITEM, REQUEST_REVIEW } from "./actionTypes";

const INITIAL_STATE = {
    uid: '',
    fetched: false,
    initializeUser: false,
    notificationToken: '',
    requestReview: false
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
        case PURCHASE_ITEM:
            return {
                ...state,
                expiredAt: action.payload.expiredAt,
                subscription: action.payload.subscription,
                orderId: action.payload.orderId
            }
        case REQUEST_REVIEW:
            return {
                ...state,
                requestReview: false
            }
        case SIGN_OUT:
            return { ...INITIAL_STATE, fetched: true };
        default:
            return state;
    }
}