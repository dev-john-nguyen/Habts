import { SequenceType, HabitEditProps } from "../../services/habits/types";
import { dailyGoals } from "../../services/habits/utils/variables";

export const currentDate = new Date();

export const emptyHabitEdit: HabitEditProps = {
    startTime: {
        date: currentDate,
        hour: 0,
        minute: 0
    },
    endTime: {
        date: currentDate,
        hour: 0,
        minute: 0
    },
    docId: '',
    cue: '',
    locationDes: '',
    notes: '',
    notificationOn: true,
    notificationTime: {
        date: currentDate,
        hour: 0,
        minute: 0,
        totalMins: 0
    }
}

export const emptyHabitExtra = {
    totalCount: 0,
    consecutive: dailyGoals,
    docId: '',
    startDate: currentDate,
    endDate: currentDate,
    createdAt: currentDate,
    updatedAt: currentDate,
    completedHabits: []
}

export const charLimitHabitName = 25;
export const charLimitLocation = 25
export const charLimitNotes = 500;
export const charCue = 100;

export const arrayOfNums = (len: number) => {
    let arr: number[] = [];
    for (let i = 0; i < len; i += 5) {
        arr.push(i)
    }
    return arr
}
