import { SET_REVIEWS, ADD_REVIEW, UPDATE_REVIEW, SIGNOUT_REVIEWS } from "./actionTypes"
import { ReviewProps } from "./types"

const INITIAL_STATE = {
    reviews: []
}

export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case SET_REVIEWS:
            return {
                ...state,
                ...action.payload,
                reviews: descendingOrder(action.payload.reviews)
            }
        case ADD_REVIEW:
            return {
                ...state,
                reviews: action.payload
            }
        case UPDATE_REVIEW:
            return {
                ...state,
                reviews: action.payload
            }
        case SIGNOUT_REVIEWS:
            return INITIAL_STATE;
        default:
            return state;
    }
}

function descendingOrder(reviews: ReviewProps[]) {
    return reviews.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())
}

