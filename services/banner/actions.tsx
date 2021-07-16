import { SET_BANNER, REMOVE_BANNER, SET_CONGRATS_BANNER, REMOVE_CONGRATS_BANNER } from "./actionTypes";

export function setBanner(type: string, message: string) {
    return {
        type: SET_BANNER,
        payload: { type, message }
    }
}

export function removeBanner() {
    return {
        type: REMOVE_BANNER
    }
}

export function setCongratsBanner(goalIndex: number, headerText: string) {
    return {
        type: SET_CONGRATS_BANNER,
        payload: { goalIndex, headerText }
    }
}

export function removeCongratsBanner() {
    return {
        type: REMOVE_CONGRATS_BANNER
    }
}