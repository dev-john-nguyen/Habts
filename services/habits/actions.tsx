import NetInfo from "@react-native-community/netinfo";
import { AppDispatch } from "../../App";
import { NewHabitProps, HabitEditProps, TimeDataProps, SequenceType } from "./types";
import { setBanner } from "../banner/actions";
import Database from "../../constants/Database";
import { ReducerStateProps } from "..";
import { ADD_HABIT, ADD_COMPLETED_HABIT, UPDATE_HABIT, ARCHIVE_HABIT } from "./actionTypes";
import { processArchiveHabit, saveNotificationData, orderAndFormatHabits, handleCompletedHabit, removeNotification } from "./utils";
import { isInvalidTime, convertTimeToInt } from "../../utils/tools";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AutoId } from "../../utils/styles";
import { dailyGoals, otherGoals } from "./utils/variables";
import { DateTime } from "luxon";

export const addHabit = (habit: NewHabitProps) => async (dispatch: AppDispatch, getState: () => ReducerStateProps) => {
    let k: keyof NewHabitProps;

    for (k in habit) {
        if (k !== 'notes' && k !== 'remove' && k == 'notificationTime' && k == 'notificationTime') {
            if (!habit[k]) {
                dispatch(setBanner('warning', 'Please make sure all the required fields are filled out.'))
                return;
            }
        }
    }

    let timeInterfereWarning = '';
    let notificationWarning = '';

    //validate start and end time
    const habitsStore = getState().habits.habits;
    const prepareValidation: TimeDataProps = { startTime: habit.startTime, endTime: habit.endTime, docId: '' }

    const { type, message } = isInvalidTime(prepareValidation, habitsStore)

    if (type === 'error') {
        dispatch(setBanner('warning', message))
        return;
    }

    if (type === 'warning') {
        timeInterfereWarning = message;
    }

    const { uid, notificationToken } = getState().user;

    const dateNow = new Date();

    //determine what kind of habit // reference sequence ....


    const newHabit: any = {
        ...habit,
        notificationOn: !notificationToken ? false : habit.notificationOn,
        createdAt: dateNow,
        updatedAt: dateNow,
        completedHabits: [],
        consecutive: habit.sequence.type == SequenceType.daily ? dailyGoals() : otherGoals(habit.sequence.value.length),
        docId: AutoId.newId()
    }

    if (newHabit.notificationOn) {
        try {
            const state = await NetInfo.fetch();
            if (state.isConnected) {
                await saveNotificationData(newHabit, uid, notificationToken)
            } else {
                notificationWarning = "Failed to turn on notification. Looks like your offline.";
                newHabit.notificationOn = false
            }
        } catch (err) {
            console.log(err)
            notificationWarning = "Failed to turn on notification. Please check your mobile connection.";
            newHabit.notificationOn = false
        }
    }

    //get store habits
    const { habits } = getState().habits;

    //add the new habit to store
    const updatedHabits = orderAndFormatHabits([...habits, newHabit]);

    await AsyncStorage.setItem(uid + Database.Habits, JSON.stringify(updatedHabits))
        .then(() => {
            dispatch({ type: ADD_HABIT, payload: updatedHabits })
            if (timeInterfereWarning) {
                dispatch(setBanner('warning', `${timeInterfereWarning} ${habit.name} succcessfully saved!`));
            } else if (notificationWarning) {
                dispatch(setBanner('warning', `${notificationWarning} ${habit.name} succcessfully saved!`));
            } else {
                dispatch(setBanner('success', `${habit.name} succcessfully saved!`));
            }
        })
        .catch((err) => {
            console.log(err)
            dispatch(setBanner('error', 'Failed to save your new habit. Please try again.'));
            throw new Error('unexpected error occured saving in storage.')
        })

    return true;
}

export const addCompletedHabit = (habitDocId: string, prevDay?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerStateProps) => {
    if (!habitDocId) {
        dispatch(setBanner('error', "Sorry, I couldn't find your habit id."))
        return;
    }

    let newDate: Date;

    if (prevDay) {
        let d = new Date()
        newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
    } else {
        newDate = new Date()
    }

    const { habits, user } = getState();

    const updatedHabitsStore = handleCompletedHabit([...habits.habits], { habitDocId, newDate });


    await AsyncStorage.setItem(user.uid + Database.Habits, JSON.stringify(updatedHabitsStore))
        .then(() => {
            dispatch({ type: ADD_COMPLETED_HABIT, payload: updatedHabitsStore })
        })
        .catch((err) => {
            console.log(err)
            dispatch(setBanner('error', "Sorry, looks like we are having trouble saving your completed habit. Keep going tho!"))
        })
}

export const updateHabit = (updatedHabit: HabitEditProps) => async (dispatch: AppDispatch, getState: () => ReducerStateProps) => {
    const { user } = getState();

    const habits = [...getState().habits.habits]

    const { uid, notificationToken } = user;

    const originalHabit = habits.find((item) => item.docId === updatedHabit.docId)

    if (!originalHabit) {
        dispatch(setBanner('error', "Sorry, we couldn't found the habit you are trying to edit."))
        return false;
    }

    let timeInterfereWarning = '';
    let notificationWarning = '';

    let updateNotificationData = false;

    //check if times are different
    if (convertTimeToInt(originalHabit.startTime) != convertTimeToInt(updatedHabit.startTime) || convertTimeToInt(originalHabit.endTime) != convertTimeToInt(updatedHabit.endTime)) {

        const { type, message } = isInvalidTime({ startTime: updatedHabit.startTime, endTime: updatedHabit.endTime, docId: updatedHabit.docId }, [...habits])


        if (type == 'error') {
            dispatch(setBanner('warning', message))
            return false;
        } else if (type == 'warning') {
            timeInterfereWarning = message;
        }

        if (convertTimeToInt(originalHabit.startTime) != convertTimeToInt(updatedHabit.startTime)) {
            updateNotificationData = true;
        }
    }

    if (!notificationToken && updatedHabit.notificationOn) {
        notificationWarning = "Failed to turn on notification. Don't have access to notification credentials.";
        updatedHabit.notificationOn = false;
    }


    //recalc notificationData
    if (updatedHabit.notificationOn && !originalHabit.notificationOn) {

        //previous configuration if user wanted to be notified before their habit time.
        const orgnalNotifyDate = new Date(updatedHabit.startTime.date)
        // const updatedNotificationDate = new Date(orgnalNotifyDate.getFullYear(), orgnalNotifyDate.getMonth(), orgnalNotifyDate.getDate(), orgnalNotifyDate.getHours(), orgnalNotifyDate.getMinutes() - updatedHabit.notificationTime.totalMins);

        const updatedNotificationDate = new Date(orgnalNotifyDate.getFullYear(), orgnalNotifyDate.getMonth(), orgnalNotifyDate.getDate(), orgnalNotifyDate.getHours(), orgnalNotifyDate.getMinutes());


        updatedHabit.notificationTime = {
            date: updatedNotificationDate,
            hour: updatedNotificationDate.getHours(),
            minute: updatedNotificationDate.getMinutes(),
            zoneName: DateTime.now().zoneName,
            totalMins: updatedHabit.notificationTime.totalMins
        }

        updateNotificationData = true;

    }

    const habitIndex = habits.findIndex((item) => item.docId === updatedHabit.docId);

    //now update habits
    habits[habitIndex] = {
        ...habits[habitIndex],
        ...updatedHabit
    }

    const state = await NetInfo.fetch();
    const warningMsg = "Failed to update notification data. Please check your mobile connection";

    if (originalHabit.notificationOn && !updatedHabit.notificationOn) {
        //notification was turned off, so remove notification
        try {
            if (state.isConnected) {
                await removeNotification(originalHabit.notificationTime, uid, originalHabit.docId)
            } else {
                notificationWarning = warningMsg;
                habits[habitIndex].notificationOn = true
            }
        } catch (err) {
            console.log(err)
            notificationWarning = warningMsg;
            habits[habitIndex].notificationOn = true;
        }
    } else if (updateNotificationData || updatedHabit.notificationOn) {
        try {
            if (state.isConnected) {
                await saveNotificationData(habits[habitIndex], uid, notificationToken, originalHabit.notificationTime);
            } else {
                notificationWarning = warningMsg;
                habits[habitIndex].notificationOn = false
            }
        } catch (err) {
            console.log(err)
            notificationWarning = warningMsg;
            habits[habitIndex].notificationOn = false;
        }
    }

    const updatedHabits = orderAndFormatHabits(habits);

    await AsyncStorage.setItem(uid + Database.Habits, JSON.stringify(updatedHabits))
        .then(() => {
            dispatch({ type: UPDATE_HABIT, payload: updatedHabits })
            if (timeInterfereWarning) {
                dispatch(setBanner('warning', `${timeInterfereWarning} ${habits[habitIndex].name} succcessfully saved!`))
            } else if (notificationWarning) {
                dispatch(setBanner('warning', `${notificationWarning} ${habits[habitIndex].name} succcessfully saved!`))
            } else {
                dispatch(setBanner('success', `${habits[habitIndex].name} succcessfully saved!`))
            }

            return true;
        })
        .catch((err) => {
            console.log(err)
            dispatch(setBanner('error', 'Oops! Something went wrong updating your habit. Please try again.'));
            return false;
        })

}

export const archiveHabit = (docId: string) => async (dispatch: AppDispatch, getState: () => ReducerStateProps) => {
    const { uid } = getState().user;

    if (!docId) {
        dispatch(setBanner('error', "Sorry, looks like we are having a hard time finding the habit."));
        return false;
    }

    const archivedDate = new Date()

    const localArchivedData = {
        docId: docId,
        archivedAt: archivedDate
    }

    const habitsStore = getState().habits;

    //update habits store
    const { habits, archivedHabits } = processArchiveHabit([...habitsStore.habits], [...habitsStore.archivedHabits], localArchivedData)
    const archivedHabit = archivedHabits.find(item => item.docId === docId);

    try {
        if (archivedHabit && archivedHabit.notificationOn) {
            const state = await NetInfo.fetch();
            if (state.isConnected) {
                await removeNotification(archivedHabit.notificationTime, uid, archivedHabit.docId)
            } else {
                throw new Error('No connected to internet')
            }
        }
    } catch (err) {
        console.log(err)
        dispatch(setBanner('error', "Need to be connected to the internet to remove this habit or turn notification off. Please try again."));
        return false;
    }

    try {
        await AsyncStorage.setItem(uid + Database.ArchivedHabits, JSON.stringify(archivedHabits))
        await AsyncStorage.setItem(uid + Database.Habits, JSON.stringify(habits))
    } catch (err) {
        console.log(err)
        dispatch(setBanner('error', 'Oops! Something went wrong updating your habit. Please try again.'));
        return false;
    }

    dispatch({ type: ARCHIVE_HABIT, payload: { habits, archivedHabits } })
    dispatch(setBanner('success', "Successfully archived."));
    return true;
}