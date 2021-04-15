import { HabitProps, HabitEditProps, Time, SequenceType, SequenceProps } from "./types";
import { isValidTime, convertTimeToInt, formatTimeForNotification } from "../../utils/tools";
import { realtimeDb } from "../../firebase";
import Database from "../../constants/Database";
import { DateTime } from "luxon";

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
        habits[foundHabit].completedHabits = [...habits[foundHabit].completedHabits, { dateCompleted: payload.newDate }]
        //update total and consecutive days
        habits[foundHabit].totalCount = habits[foundHabit].completedHabits.length;
        habits[foundHabit].consecutive = calcConsecutiveDays(habits[foundHabit]);
    }

    return habits;
}

export function orderAndFormatHabits(habits: HabitProps[]) {
    return habits.sort((a, b) => convertTimeToInt(a.startTime) - convertTimeToInt(b.startTime)).map((habit) => {
        const { completedHabits } = habit;
        //set total count
        habit.totalCount = completedHabits.length;
        //calc consecutive days
        habit.consecutive = calcConsecutiveDays(habit);

        return habit;

    })
}

export function calcConsecutiveDays(habit: HabitProps) {
    const { completedHabits, sequence } = habit;

    if (completedHabits.length < 1) return 0;

    //sort ascending
    completedHabits.sort((a, b) => b.dateCompleted.getTime() - a.dateCompleted.getTime());

    if (sequence.type == SequenceType.weekly) return calcWeeklyConsecutive(completedHabits, sequence.value)
    if (sequence.type == SequenceType.monthly) return calcMonthlyConsecutive(completedHabits, sequence.value)
    return calcDailyConsecutive(completedHabits)
}

function calcWeeklyConsecutive(completedHabits: HabitProps['completedHabits'], sequenceVals: SequenceProps['value']) {
    let count = 0;
    let dayOfWeekCount = 0;
    //sort sequence in ascending order
    if (!sequenceVals) return 0;

    sequenceVals.sort((a, b) => a - b);

    for (let i = 0; i < completedHabits.length; i++) {
        let targetDate = completedHabits[i].dateCompleted;
        let targetDayOfWeek = targetDate.getDay();

        if (i == 0) {
            let foundIndex = sequenceVals.findIndex(val => targetDayOfWeek == val);
            if (foundIndex < 0) {
                break;
            }
            dayOfWeekCount = foundIndex;
        }

        if (targetDayOfWeek != sequenceVals[dayOfWeekCount]) {
            break;
        }

        if (dayOfWeekCount == 0) {
            dayOfWeekCount = sequenceVals.length - 1;
        } else {
            dayOfWeekCount--
        }

        count++
    }

    return count
}

function calcMonthlyConsecutive(completedHabits: HabitProps['completedHabits'], sequenceVals: SequenceProps['value']) {
    let count = 0;
    let indexOfMonth = 0;

    if (!sequenceVals) return 0;

    sequenceVals.sort((a, b) => a - b);

    for (let i = 0; i < completedHabits.length; i++) {
        let targetDate = completedHabits[i].dateCompleted;
        let targetDayOfWeek = targetDate.getDate();

        if (i == 0) {
            let foundIndex = sequenceVals.findIndex(val => targetDayOfWeek == val);
            if (foundIndex < 0) {
                break;
            }
            indexOfMonth = foundIndex;
        }

        if (targetDayOfWeek != sequenceVals[indexOfMonth]) {
            break;
        }

        if (indexOfMonth == 0) {
            indexOfMonth = sequenceVals.length - 1;
        } else {
            indexOfMonth--
        }

        count++
    }

    return count
}

function calcDailyConsecutive(completedHabits: HabitProps['completedHabits']) {
    if (completedHabits.length < 1) return 0;
    if (completedHabits.length == 1) return 1;

    let count = 0;

    for (let i = 1; i < completedHabits.length; i++) {
        let curDate = completedHabits[i].dateCompleted
        let prevCompletedDate = completedHabits[i - 1].dateCompleted;
        let previousDate = new Date(prevCompletedDate.getFullYear(), prevCompletedDate.getMonth(), prevCompletedDate.getDate() - 1)
        let previousDateStr = previousDate.getFullYear().toString() + previousDate.getMonth().toString() + previousDate.getDate().toString()
        let curDateStr = curDate.getFullYear().toString() + curDate.getMonth().toString() + curDate.getDate().toString();

        if (previousDateStr != curDateStr) {
            if (i === 1) count++
            break;
        }

        if (i == 1) {
            count++
        }
        count++
    }

    return count
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
        cue: habit.cue,
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