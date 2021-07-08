import { HabitProps, HabitEditProps, Time, SequenceType } from "../types";
import { convertTimeToInt, isValidTime, formatTimeForNotification } from "../../../utils/tools";
import { realtimeDb } from "../../../firebase"; import Database from "../../../constants/Database";
import { DateTime } from "luxon";
import { consecutiveTools } from "./consecutive";

export function processArchiveHabit(habits: HabitProps[], archivedHabits: HabitProps[], archivedData: { docId: string, archivedAt: Date }) {
    const foundHabit = habits.findIndex((habit) => habit.docId === archivedData.docId);

    if (foundHabit < 0) return { habits, archivedHabits }

    archivedHabits.push({ ...habits[foundHabit], archivedAt: archivedData.archivedAt })

    habits.splice(foundHabit, 1)

    return {
        habits,
        archivedHabits
    }
}

export function findAndUpdateHabit(habits: HabitProps[], habit: HabitEditProps) {
    const targetIndex = habits.findIndex((item) => item.docId === habit.docId)
    if (targetIndex < 0) {
        return habits;
    }

    habits[targetIndex] = {
        ...habits[targetIndex],
        ...habit
    }
    //reorder after changes
    return orderAndFormatHabits(habits)
}

export function handleCompletedHabit(habits: HabitProps[], payload: { habitDocId: string, newDate: Date }) {
    const foundHabit = habits.findIndex((habit) => habit.docId === payload.habitDocId);

    if (foundHabit >= 0) {

        //check duplicate date
        const isDuplicate = habits[foundHabit].completedHabits.find(({ dateCompleted }) => consecutiveTools.datesAreOnSameDay(dateCompleted, payload.newDate));
        if (isDuplicate) return habits;

        habits[foundHabit].completedHabits = [...habits[foundHabit].completedHabits, { dateCompleted: payload.newDate }]
        //update total and consecutive days
        habits[foundHabit].totalCount = habits[foundHabit].completedHabits.length;
        habits[foundHabit].consecutive = handleConsecutiveDays(habits[foundHabit], payload.newDate);
    }

    return habits;
}

function handleConsecutiveDays(habit: HabitProps, newCompletedDate: Date): HabitProps['consecutive'] {
    const { completedHabits, sequence } = habit;

    if (completedHabits.length < 1) return habit.consecutive;

    //sort ascending
    completedHabits.sort((a, b) => b.dateCompleted.getTime() - a.dateCompleted.getTime());

    return consecutiveTools.updateConsecutive(habit, newCompletedDate)
}

export function orderAndFormatHabits(habits: HabitProps[]) {
    return habits.sort((a, b) => convertTimeToInt(a.startTime) - convertTimeToInt(b.startTime))
}

export async function saveNotificationData(habit: HabitProps, uid: string, notificationToken: string, previousTime?: Time) {
    //loop through notificationData and get times and create ref for store
    //the notificaitonTime will be in DateTime format
    if (!isValidTime(habit.notificationTime)) return 'invalid time';

    let timeString = formatTimeForNotification(habit.notificationTime)

    if (habit.archivedAt) {
        return realtimeDb.ref(`${timeString}/${uid}`).remove()
    }

    if (!notificationToken) return 'no token';

    const baseRef = Database.NotificationRealDb.habits;

    const timesRef: any = {}

    if (previousTime) {
        if (convertTimeToInt(previousTime) !== convertTimeToInt(habit.notificationTime)) {
            const prevTimeString = formatTimeForNotification(previousTime)
            const prevHabitTimeRef = `${baseRef}/${prevTimeString}/${uid}/${habit.docId}`;
            timesRef[prevHabitTimeRef] = null
        }
    }

    const habitTimeRef = `${baseRef}/${timeString}/${uid}/${habit.docId}`;

    const updatedAt = DateTime.utc().toMillis()

    timesRef[habitTimeRef] = habit.notificationOn ? {
        name: habit.name,
        notificationTime: habit.notificationTime.date,
        notificationTotalMins: habit.notificationTime.totalMins,
        notificationToken,
        notificationOn: habit.notificationOn,
        sequence: habit.sequence,
        habitId: habit.docId,
        updatedAt: updatedAt
    } : null

    return realtimeDb.ref().update(timesRef)
}

export async function removeNotification(previousTime: Time, uid: string, docId: string) {
    const prevTimeString = formatTimeForNotification(previousTime)
    const removeRef = `${Database.NotificationRealDb.habits}/${prevTimeString}/${uid}/${docId}`;
    await realtimeDb.ref(removeRef).remove()
}