import { combineReducers } from 'redux';

import userReducer from './user/reducer';
import reviewsReducer from './reviews/reducer';
import habitsReducer from './habits/reducer';
import bannerReducer from './banner/reducer';

import { UserProps } from './user/types';
import { ReviewsProps } from './reviews/types';
import { HabitsProps } from './habits/types';
import { BannerProps } from './banner/types';

export default combineReducers({
    user: userReducer,
    reviews: reviewsReducer,
    habits: habitsReducer,
    banner: bannerReducer
});


export interface ReducerStateProps {
    user: UserProps;
    reviews: ReviewsProps;
    habits: HabitsProps;
    banner: BannerProps;
}