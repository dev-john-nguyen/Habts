import { HabitProps, CompletedHabitsProps, SequenceType, SequenceProps } from "../types";
import { dailyGoals } from "./variables";

export function calcConsecutiveDays(habit: HabitProps): CompletedHabitsProps[] {
    const { completedHabits, sequence } = habit;

    if (completedHabits.length < 1) return [];

    //sort ascending
    completedHabits.sort((a, b) => b.dateCompleted.getTime() - a.dateCompleted.getTime());

    if (sequence.type == SequenceType.weekly) return calcWeeklyConsecutive(completedHabits, sequence.value)
    if (sequence.type == SequenceType.monthly) return calcMonthlyConsecutive(completedHabits, sequence.value)
    return calcDailyConsecutive(completedHabits)
}

function calcWeeklyConsecutive(completedHabits: HabitProps['completedHabits'], sequenceVals: SequenceProps['value']) {
    if (completedHabits.length < 1) return [];
    if (completedHabits.length == 1) return [completedHabits[0]];
    let count: HabitProps['completedHabits'] = [];
    let dayOfWeekCount = 0;
    //sort sequence in ascending order
    if (!sequenceVals) return count;

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

        count.push(completedHabits[i])
    }

    return count
}

function calcMonthlyConsecutive(completedHabits: HabitProps['completedHabits'], sequenceVals: SequenceProps['value']) {
    if (completedHabits.length < 1) return [];
    if (completedHabits.length == 1) return [completedHabits[0]];

    let count: HabitProps['completedHabits'] = [];
    let indexOfMonth = 0;

    if (!sequenceVals) return count;

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

        count.push(completedHabits[i])
    }

    return count
}

function calcDailyConsecutive(completedHabits: HabitProps['completedHabits']) {
    if (completedHabits.length < 1) return [];
    if (completedHabits.length == 1) return [completedHabits[0]];

    //sort from farthest to closest dates
    //make sure there are not duplicates
    completedHabits.sort((a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime())

    let count: HabitProps['completedHabits'] = [];

    for (let i = 0; i < completedHabits.length; i++) {
        const recentNxtStr = getNextDays(completedHabits[i].dateCompleted, 1);
        if (!completedHabits[i + 1]) break;
        const nxtDateStr = getNextDays(completedHabits[i + 1].dateCompleted, 0);


        if (!datesAreOnSameDay(recentNxtStr, nxtDateStr)) {
            const recentTwoNxtStr = getNextDays(completedHabits[i].dateCompleted, 2);
            if (!completedHabits[i + 2]) break;
            const nxtNxtDateStr = getNextDays(completedHabits[i + 2].dateCompleted, 0);
            if (!datesAreOnSameDay(recentTwoNxtStr, nxtNxtDateStr)) {
                //if missed two go back to previous
                count = revertToPrevDailyGoals(count);
                continue;
            }
        }

        count.unshift(completedHabits[i])
    }


    return count
}

function datesAreOnSameDay(first: Date, second: Date) {
    return first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();
}

function getNextDays(d: Date, days: number) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
}

function revertToPrevDailyGoals(countedHabits: HabitProps['completedHabits']) {
    const completeLen = countedHabits.length;

    if (completeLen >= dailyGoals.four.count) {
        return [...countedHabits.splice((completeLen - dailyGoals.four.count), dailyGoals.four.count)]
    }

    if (completeLen >= dailyGoals.three.count) {
        return [...countedHabits.splice((completeLen - dailyGoals.three.count), dailyGoals.three.count)]
    }

    if (completeLen >= dailyGoals.two.count) {
        return [...countedHabits.splice((completeLen - dailyGoals.two.count), dailyGoals.two.count)]
    }

    if (completeLen >= dailyGoals.one.count) {
        return [...countedHabits.splice((completeLen - dailyGoals.one.count), dailyGoals.one.count)]
    }

    return []
}