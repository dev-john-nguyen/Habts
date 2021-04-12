import { firebaseDb, firestoreDb, realtimeDb } from '../../firebase';
import "firebase/auth";
import { AppDispatch } from '../../App';
import { FETCHED, SET_USER, SET_NOTIFICATION_TOKEN, SIGN_OUT } from './actionTypes';
import { fetchStorage } from './utils';
import { SET_HABITS } from '../habits/actionTypes';
import { SET_REVIEWS } from '../reviews/actionTypes';
import { setBanner } from '../banner/actions';
import Database from '../../constants/Database';
import { ReducerStateProps } from '..';
import { DateTime } from 'luxon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatTimeForNotification } from '../../utils/tools';


export const verifyAuth = (state: ReducerStateProps): any => (dispatch: AppDispatch) => {

    // firebaseDb.auth().onAuthStateChanged(async (user) => {
    //     if (user){
    //         if(state.user.initializeUser && state.user.initializeUserData) {
    //             //init user
    //             await firestoreDb.collection(Database.Users).doc(user.uid).set(state.user.initializeUserData)
    //             await AsyncStorage.setItem(user.uid + Database.Users, JSON.stringify(state.user.initializeUserData))
    //             dispatch({ type: SET_USER, payload: state.user.initializeUserData })
    //         }
    //     }
    // }, err => {
    //     console.log(err)
    //     dispatch(setBanner('error', 'Sorry! Failed to initialize your acccount.'));
    //     dispatch({ type: FETCHED })
    // })

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

        const userStorage = {
            uid: user.uid,
            createdAt: new Date()
        }
        await firestoreDb.collection(Database.Users).doc(userStorage.uid).set(userStorage)
        await AsyncStorage.setItem(userStorage.uid + Database.Users, JSON.stringify(userStorage))
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

        const { createdAt, notificationToken, loginAt } = userData.data() as { createdAt: Date, notificationToken: string, loginAt: Date }

        const userStorage = {
            uid: user.uid,
            createdAt: createdAt.toDate(),
            notificationToken,
            loginAt: loginAt.toDate()
        }

        //update login date
        const updatedAt = DateTime.utc()

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

export const signOut = () => async (dispatch: AppDispatch) => {
    try {
        await AsyncStorage.removeItem(Database.currentUser)
        dispatch({ type: SIGN_OUT })
    } catch (err) {
        console.log(err)
        dispatch(setBanner('error', 'Failed to sign you out. Please try again.'))
    }
}

export const saveNotificationToken = (token: string) => async (dispatch: AppDispatch, getState: () => ReducerStateProps) => {
    const { uid, createdAt, notificationToken } = getState().user;

    // if (notificationToken == token) return;

    const formatCreatedAt = DateTime.local(createdAt.getFullYear(), createdAt.getMonth() + 1, createdAt.getDate(), 12, 5);
    const utcDate = formatCreatedAt.toUTC();
    const day = utcDate.day;

    const minStr = utcDate.minute < 10 ? ('0' + utcDate.minute) : utcDate.minute;
    const hourStr = utcDate.hour < 10 ? ('0' + utcDate.hour) : utcDate.hour;
    const formatTime = hourStr + ':' + minStr;

    try {
        await realtimeDb.ref(`notifications/reviews/${day}/${formatTime}/${uid}`).set({
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