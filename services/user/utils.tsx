import { firestoreDb } from "../../firebase";
import Database from '../../constants/Database';
import firebase from 'firebase';
import { HabitProps } from "../habits/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReviewProps } from "../reviews/types";
import { UserProps } from "./types";

const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()

function convertCompletedHabitsDate(dates: HabitProps['completedHabits']) {
    if (!dates) return [];
    return dates.map((date: any) => {
        return { dateCompleted: date.dateCompleted.toDate() }
    })
}

export async function fetchUserData(uid: string, email: string | null) {
    const user = await firestoreDb.collection(Database.Users).doc(uid).get()
        .then(async (doc) => {
            if (!doc.exists) {
                //new user
                try {
                    await createUser(uid, email)
                } catch (err) {
                    console.log(err)
                    throw { createUserFailed: true }
                }
                return { uid, email }
            }

            const data = doc.data();

            if (!data) return {}

            return {
                ...data,
                createdAt: data.createdAt.toDate()
            }
        })
    const habits: { habits: any, archivedHabits: any } = await firestoreDb.collection(Database.Habits).doc(uid).collection(Database.habits).get()
        .then((querySnapShot) => {
            let habits: any[] = [];
            let archivedHabits: any[] = [];

            querySnapShot.docs.forEach((doc) => {
                if (!doc.exists) return;

                const data = doc.data() as HabitProps;

                const preparedHabit: HabitProps = {
                    ...data,
                    docId: doc.id,
                    createdAt: data.createdAt.toDate(),
                    startTime: {
                        ...data.startTime,
                        date: data.startTime.date.toDate()
                    },
                    endTime: {
                        ...data.endTime,
                        date: data.endTime.date.toDate()
                    },
                    completedHabits: convertCompletedHabitsDate(data.completedHabits),
                    archivedAt: data.archivedAt ? data.archivedAt.toDate() : undefined
                }

                if (data.archivedAt) {
                    archivedHabits.push(preparedHabit)
                } else {
                    habits.push(preparedHabit)
                }

            })

            return {
                habits,
                archivedHabits
            }
        })
    const reviews = await firestoreDb.collection(Database.Reviews).doc(uid).collection(Database.reviews).get()
        .then((querySnapShot) => {
            return querySnapShot.docs.map((doc) => {
                if (!doc.exists) return
                const data = doc.data();

                return {
                    ...data,
                    docId: doc.id,
                    createdAt: data.createdAt.toDate()
                }
            })
        })

    return {
        user,
        habits,
        reviews
    }
}

function convertHabitDates(habitsStorage: HabitProps[]) {
    habitsStorage.forEach(habit => {
        habit.startDate = new Date(habit.startDate);
        habit.endDate = new Date(habit.endDate);
        habit.endTime.date = new Date(habit.endTime.date);
        habit.startTime.date = new Date(habit.startTime.date);
        habit.createdAt = new Date(habit.createdAt);
        habit.archivedAt = habit.archivedAt ? new Date(habit.archivedAt) : habit.archivedAt;
        habit.completedHabits.forEach((d, i) => habit.completedHabits[i] = { dateCompleted: new Date(d.dateCompleted) })
    });

    return habitsStorage;
}

function convertReviewDates(reviewsStorage: ReviewProps[]) {
    reviewsStorage.forEach(review => {
        review.createdAt = new Date(review.createdAt);
        review.updatedAt = review.updatedAt ? new Date(review.updatedAt) : review.updatedAt
    })

    return reviewsStorage;
}

function convertUserDates(userStorage: UserProps): UserProps {
    return {
        ...userStorage,
        createdAt: new Date(userStorage.createdAt),
        expiredAt: new Date(userStorage.expiredAt)
    }
}

const empty = {
    user: null,
    habits: {
        habits: [],
        archivedHabits: []
    },
    reviews: []
}

export async function fetchStorage() {
    const userId = await AsyncStorage.getItem(Database.currentUser);

    if (!userId) return empty;

    const usersStorage = await AsyncStorage.getItem(userId + Database.Users);

    const user = usersStorage != null ? convertUserDates(JSON.parse(usersStorage)) : null;

    if (!user) return empty;

    const habitsStorage = await AsyncStorage.getItem(userId + Database.Habits);
    const archivedHabitsStorage = await AsyncStorage.getItem(userId + Database.ArchivedHabits);
    const reviewsStorage = await AsyncStorage.getItem(userId + Database.Reviews);

    const habits = {
        habits: habitsStorage != null ? convertHabitDates(JSON.parse(habitsStorage)) : [],
        archivedHabits: archivedHabitsStorage != null ? convertHabitDates(JSON.parse(archivedHabitsStorage)) : [],
    }

    const reviews = reviewsStorage != null ? convertReviewDates(JSON.parse(reviewsStorage)) : [];

    user.createdAt = new Date(user.createdAt)

    return {
        habits,
        user,
        reviews
    }
}

export async function createUser(uid: string, email: string | null) {
    // const batch = firestoreDb.batch();
    // const userRef = firestoreDb.collection(Database.Users).doc(uid)
    // batch.set(userRef, { uid, email, createdAt: serverTimestamp, updatedAt: serverTimestamp });
    await firestoreDb.collection(Database.Users).doc(uid).set({
        uid, email, createdAt: serverTimestamp, updatedAt: serverTimestamp
    })
}