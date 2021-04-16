import NetInfo from "@react-native-community/netinfo";
import { firebaseDb, firestoreDb, realtimeDb } from '../../firebase';
import "firebase/auth";
import { AppDispatch } from '../../App';
import { FETCHED, SET_USER, SET_NOTIFICATION_TOKEN, SIGN_OUT, PURCHASE_ITEM, REQUEST_REVIEW } from './actionTypes';
import { fetchStorage } from './utils';
import { SET_HABITS, SIGNOUT_HABITS } from '../habits/actionTypes';
import { SET_REVIEWS } from '../reviews/actionTypes';
import { setBanner } from '../banner/actions';
import Database from '../../constants/Database';
import { ReducerStateProps } from '..';
import { DateTime } from 'luxon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatTimeForNotification } from '../../utils/tools';
import { HabitsProps } from "../habits/types";


export const verifyAuth = (state: ReducerStateProps): any => (dispatch: AppDispatch) => {
    fetchStorage()
        .then((data) => {
            dispatch({ type: SET_USER, payload: data.user });
            dispatch({ type: SET_HABITS, payload: { habits: data.habits.habits, archivedHabits: data.habits.archivedHabits } });
            dispatch({ type: SET_REVIEWS, payload: { reviews: data.reviews } });
        })
        .catch((err: any) => {
            console.log(err)
            dispatch(setBanner('error', 'Oops! Something went wrong trying to fetch your user information. Please try again.'));
            dispatch({ type: FETCHED })
        })
}

export const signUp = (email: string, password: string, password2: string) => async (dispatch: AppDispatch) => {
    if (!email || !password || !password2) {
        dispatch(setBanner('error', 'Please fill in all the required fields.'));
        return;
    }

    if (password !== password2) {
        dispatch(setBanner('error', 'Passwords do not match. Please try again.'));
        return;
    }

    try {
        const { user } = await firebaseDb.auth().createUserWithEmailAndPassword(email, password);
        if (!user) throw 'Sorry, failed to get your user information'

        const utcNow = DateTime.utc()
        const expiredAt = DateTime.utc(utcNow.year, utcNow.month + 1, utcNow.day).toJSDate();

        const userStorage = {
            uid: user.uid,
            createdAt: new Date(),
            expiredAt: expiredAt,
            loginAt: utcNow.toJSDate(),
            subscription: Database.oneMonthFreeTrail
        }

        await firestoreDb.collection(Database.Users).doc(userStorage.uid).set(userStorage)

        await AsyncStorage.setItem(Database.currentUser, userStorage.uid);

        await AsyncStorage.setItem(userStorage.uid + Database.Users, JSON.stringify({ ...userStorage, requestReview: true }))

        dispatch({ type: SET_USER, payload: userStorage })
    } catch (error) {
        var errorCode = error.code;
        switch (errorCode) {
            case 'auth/email-already-in-use':
                dispatch(setBanner('error', 'Email is already registered with us. Please sign in with that email.'));
                return;
            case 'auth/invalid-email':
                dispatch(setBanner('error', 'The email is invalid. Please try again.'));
                return;
            case 'auth/operation-not-allowed':
                dispatch(setBanner('error', 'Invalid operation. Please try again.'));
                return;
            case 'auth/weak-password':
                dispatch(setBanner('error', 'Password is too weak. Please try again.'));
                return;
            default:
                dispatch(setBanner('error', 'Unexpected error. Please try again.'));
                return;
        }
    }

}

export const signIn = (email: string, password: string) => async (dispatch: AppDispatch) => {

    try {
        const { user } = await firebaseDb.auth().signInWithEmailAndPassword(email, password);
        if (!user) throw 'Failed to get your user information.'

        const userData = await firestoreDb.collection(Database.Users).doc(user.uid).get();

        if (!userData.exists) throw 'Failed to get your profile information.'

        const { createdAt, notificationToken, expiredAt } = userData.data() as { createdAt: Date, notificationToken: string, expiredAt: Date }

        //update login date
        const updatedAt = DateTime.utc()

        const userStorage = {
            uid: user.uid,
            createdAt: createdAt.toDate(),
            notificationToken,
            loginAt: updatedAt.toJSDate(),
            expiredAt: expiredAt.toDate()
        }

        await firestoreDb.collection(Database.Users).doc(user.uid).set({
            loginAt: updatedAt.toJSDate()
        }, { merge: true })


        await AsyncStorage.setItem(Database.currentUser, userStorage.uid);

        await AsyncStorage.setItem(userStorage.uid + Database.Users, JSON.stringify(userStorage));

        const data = await fetchStorage();

        //update habit notifications

        const notifyBatch: any = {};
        const baseRef = Database.NotificationRealDb.habits;

        data.habits.habits.forEach(habit => {
            if (!habit.notificationOn) return;

            let timeString = formatTimeForNotification(habit.notificationTime)
            const habitTimeRef = `${baseRef}/${timeString}/${user.uid}/${habit.docId}`;

            notifyBatch[habitTimeRef] = {
                updatedAt: updatedAt.toMillis(),
                name: habit.name,
                cue: habit.cue,
                notificationTime: habit.notificationTime.date,
                notificationTotalMins: habit.notificationTime.totalMins,
                notificationToken,
                notificationOn: habit.notificationOn,
                sequence: habit.sequence,
                habitId: habit.docId,
            }
        })

        if (Object.keys(notifyBatch).length > 0) {
            await realtimeDb.ref().update(notifyBatch);
        }

        dispatch({ type: SET_USER, payload: data.user });
        dispatch({ type: SET_HABITS, payload: { habits: data.habits.habits, archivedHabits: data.habits.archivedHabits } });
        dispatch({ type: SET_REVIEWS, payload: { reviews: data.reviews } });

    } catch (error) {
        console.log(error)
        var errorCode = error.code;
        switch (errorCode) {
            case 'auth/user-disabled':
                dispatch(setBanner('error', "This account has been disabled. Please contact us directly."));
                break;
            case 'auth/invalid-email':
                dispatch(setBanner('error', 'The email is invalid. Please try again.'));
                break;
            case 'auth/user-not-found':
                dispatch(setBanner('error', "This email is not registered. Please sign up."));
                break;
            case 'auth/wrong-password':
                dispatch(setBanner('error', 'Incorrect password. Please try again.'));
                break;
            default:
                dispatch(setBanner('error', 'Unexpected error. Please try again.'));
                break;
        }
        throw new Error(error.code)
    }
}

export const signOut = () => async (dispatch: AppDispatch, getState: () => ReducerStateProps) => {
    const { habits, user } = getState();
    try {
        await removeNotifys(habits.habits, user.uid);
        const { ref } = getReviewDate(user.uid, user.createdAt)
        await realtimeDb.ref(ref).remove()
        await AsyncStorage.removeItem(Database.currentUser);
        dispatch({ type: SIGN_OUT })
        dispatch({ type: SIGNOUT_HABITS })
        dispatch({ type: SIGNOUT_HABITS })
    } catch (err) {
        console.log(err)
        dispatch(setBanner('error', 'Failed to sign you out. Please try again.'))
    }
}

async function removeNotifys(habits: HabitsProps['habits'], uid: string) {
    const state = await NetInfo.fetch();

    if (state.isConnected) {
        const baseRef = Database.NotificationRealDb.habits;
        const removeNotifys: any = {};

        habits.forEach(habit => {
            if (!habit.notificationOn) return;

            let timeString = formatTimeForNotification(habit.notificationTime)
            const habitTimeRef = `${baseRef}/${timeString}/${uid}/${habit.docId}`;

            removeNotifys[habitTimeRef] = null
        })

        if (Object.keys(removeNotifys).length > 0) {
            await realtimeDb.ref().update(removeNotifys);
        }

    }
}

export const saveNotificationToken = (token: string) => async (dispatch: AppDispatch, getState: () => ReducerStateProps) => {
    const { uid, createdAt, notificationToken } = getState().user;

    if (notificationToken == token) return;

    const { ref, utcDate } = getReviewDate(uid, createdAt)

    try {
        await realtimeDb.ref(ref).set({
            notificationToken: token,
            utcCreatedAt: utcDate.toString(),
            createdAt: createdAt.toString(),
            notificationOn: true
        })
    } catch (err) {
        console.log(err)
        dispatch(setBanner('error', "Failed to save notification Data"))
    }

    return firestoreDb.collection(Database.Users).doc(uid).update({ notificationToken: token })
        .then(() => {
            dispatch({ type: SET_NOTIFICATION_TOKEN, payload: token })
        })
        .catch((err) => {
            console.log(err)
        })
}

export const subscriptionPurchased = (productId: string, purchaseTime: number, orderId: string) => async (dispatch: AppDispatch, getState: () => ReducerStateProps) => {
    const { user } = getState();
    if (user.uid) return;

    const utcNow = DateTime.fromMillis(purchaseTime).toUTC();
    const expiredAt = DateTime.utc(utcNow.year, utcNow.month + 1, utcNow.day).toJSDate();

    if (user.orderId == orderId) return;

    console.log(`Successfully purchased ${productId}`);

    try {
        await firestoreDb.collection(Database.Users).doc(user.uid).set({
            expiredAt,
            subscription: productId,
            orderId: orderId
        }, { merge: true })

        await AsyncStorage.setItem(user.uid + Database.Users, JSON.stringify({
            ...user,
            expiredAt,
            subscription: productId,
            orderId: orderId
        }));
    } catch (err) {
        console.log(err)
        dispatch(setBanner('error', "Sorry, something went wrong. Completing your purchase. If you purchased an item, please contact us directly."))
        return;
    }

    dispatch({
        type: PURCHASE_ITEM, payload: {
            expiredAt,
            subscription: productId,
            orderId: orderId
        }
    })
}

export const updateRequestReview = () => async (dispatch: AppDispatch, getState: () => ReducerStateProps) => {
    const { user } = getState();

    try {
        await AsyncStorage.setItem(user.uid + Database.Users, JSON.stringify({
            ...user,
            requestReview: false
        }));
    } catch (err) {
        console.log(err)
    }

    dispatch({ type: REQUEST_REVIEW })
}

function getReviewDate(uid: string, createdAt: Date) {
    const formatCreatedAt = DateTime.local(createdAt.getFullYear(), createdAt.getMonth() + 1, createdAt.getDate(), 12, 5);
    const utcDate = formatCreatedAt.toUTC();
    const day = utcDate.day;

    const minStr = utcDate.minute < 10 ? ('0' + utcDate.minute) : utcDate.minute;
    const hourStr = utcDate.hour < 10 ? ('0' + utcDate.hour) : utcDate.hour;
    const formatTime = hourStr + ':' + minStr;

    return {
        ref: `notifications/reviews/${day}/${formatTime}/${uid}`,
        utcDate
    };
}