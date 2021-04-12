import { AppDispatch } from "../../App";
import { ReducerStateProps } from "..";
import { ReviewProps } from "./types";
import Database from "../../constants/Database";
import { setBanner } from "../banner/actions";
import { ADD_REVIEW, UPDATE_REVIEW } from "./actionTypes";
import { isEqual } from 'lodash';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AutoId } from "../../utils/styles";

export const addNewReview = (review: ReviewProps) => async (dispatch: AppDispatch, getState: () => ReducerStateProps) => {
    const { reviews, user } = getState();

    delete review.docId;

    const updatedReviewsStore = [...reviews.reviews, { ...review, docId: AutoId.newId() }]

    await AsyncStorage.setItem(user.uid + Database.Reviews, JSON.stringify(updatedReviewsStore))
        .then((docRef) => {
            dispatch({ type: ADD_REVIEW, payload: updatedReviewsStore })
            dispatch(setBanner('success', "Review successfully created!"))
        })
        .catch((err) => {
            console.log(err)
            dispatch(setBanner('success', "Sorry, looks like we are having trouble saving your review. Please try again."))
        })

}

export const updateReview = (updatedReview: ReviewProps) => async (dispatch: AppDispatch, getState: () => ReducerStateProps) => {
    const { reviews, user } = getState();

    const foundReview = reviews.reviews.find(review => review.docId === updatedReview.docId);

    if (isEqual(foundReview, updatedReview)) {
        dispatch(setBanner('warning', "No changes found"));
        return;
    }

    if (!updatedReview.docId) {
        dispatch(setBanner('error', "Sorry, looks like we couldn't found the review Id"))
        return;
    }

    const updatedReviewsStore = findAndUpdateReview(reviews.reviews, updatedReview)

    await AsyncStorage.setItem(user.uid + Database.Reviews, JSON.stringify(updatedReviewsStore))
        .then(() => {
            dispatch({ type: UPDATE_REVIEW, payload: updatedReviewsStore })
            dispatch(setBanner('success', "Review successfully updated!"))
        })
        .catch((err) => {
            console.log(err)
            dispatch(setBanner('error', "Sorry, looks like we are having trouble updating your review. Please try again."))
        })
}

function findAndUpdateReview(reviews: ReviewProps[], updatedReview: ReviewProps) {
    return reviews.map((review) => {
        if (review.docId === updatedReview.docId) {
            review = {
                ...updatedReview
            }
        }
        return review;
    })
}
