import { SET_HABITS, ADD_HABIT, ADD_COMPLETED_HABIT, UPDATE_HABIT, ARCHIVE_HABIT } from "./actionTypes"
import { orderAndFormatHabits } from "./utils"

const INITIAL_STATE = {
    habits: [],
    archivedHabits: []
}

export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case SET_HABITS:
            return {
                ...state,
                ...action.payload,
                habits: orderAndFormatHabits(action.payload.habits),
                archivedHabits: orderAndFormatHabits(action.payload.archivedHabits)
            }
        case ADD_HABIT:
            return {
                ...state,
                habits: action.payload
            }
        case ADD_COMPLETED_HABIT:
            return {
                ...state,
                habits: action.payload
            }
        case UPDATE_HABIT:
            return {
                ...state,
                habits: action.payload
            }
        case ARCHIVE_HABIT:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}