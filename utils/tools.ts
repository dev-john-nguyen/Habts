import { HabitProps, TimeDataProps, Time, SequenceType } from "../services/habits/types";
import { DateTime } from "luxon";
import { consecutiveTools } from "../services/habits/utils/consecutive";

const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function getDate(date: Date) {
    return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
}

export function formatTime(time: Time) {
    let remHour = time.hour % 12;
    let hourStr;
    if (remHour == 0) {
        hourStr = '12'
    } else if (remHour < 10) {
        hourStr = remHour
    } else {
        hourStr = remHour
    }
    let timeStr = time.minute < 10 ? ('0' + time.minute) : time.minute;
    let amPm;
    if (time.hour == 12) {
        amPm = 'pm'
    } else {
        amPm = time.hour > 12 ? 'pm' : 'am';
    }

    return hourStr + ':' + timeStr
}

export function convertTimeToInt(time: Time) {
    let hourStr;
    if (time.hour < 10) {
        hourStr = '0' + time.hour;
    } else {
        hourStr = time.hour;
    }

    let minStr;
    if (time.minute < 10) {
        minStr = '0' + time.minute;
    } else {
        minStr = time.minute;
    }
    return parseInt('1' + hourStr + '' + minStr)
}

export function getDayName(date: Date) {
    return days[date.getDay()].substring(0, 3)
}

export function getMonthShort(date: Date) {
    return months[date.getMonth()].substring(0, 3)
}

export function getMonthLong(date: Date) {
    return months[date.getMonth()]
}

export function getDateDiffInDays(a: DateTime, b: DateTime) {
    const diffObj = a.diff(b, ['months', 'days']).toObject()

    let resString = ''
    const { months, days } = diffObj;

    if (diffObj) {
        if (months) {
            resString = months + ' month(s) and ' + Math.ceil(days ? days : 0) + ' day(s)';
        } else {
            resString = Math.ceil(days ? days : 0) + ' day(s)';
        }
    }

    return { text: resString, months, days }
}

export function daysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
}

export function calcMonthsInAdvance(d: DateTime, countInMonths: number) {
    return d.plus({ months: countInMonths })
}

export function isInvalidTime(timeData: TimeDataProps, habits: HabitProps[]): { type: 'ok' | 'error' | 'warning', message: string } {

    if (!isValidTime(timeData.startTime) || !isValidTime(timeData.endTime)) return {
        type: 'error',
        message: 'Time must be in 5 minute intervals.'
    };

    //remove
    const foundIndex = habits.findIndex(habit => habit.docId === timeData.docId)

    if (foundIndex >= 0) {
        // return "Sorry, unable to find the habit you are trying to update."
        habits.splice(foundIndex, 1)
    }

    //removed warning case in regards to overlapping habits

    const startTime = convertTimeToInt(timeData.startTime)
    const endTime = convertTimeToInt(timeData.endTime)

    if (startTime >= endTime) return { type: 'error', message: 'Start time cannot be greater than or equal to your end time.' }

    return {
        type: 'ok',
        message: ''
    }
}

export function isValidTime(t: Time) {
    if (t.hour > 24 || t.hour < 0) {
        return false
    }
    if (t.minute % 5 > 0 || t.minute > 60 || t.minute < 0) {
        return false;
    }
    return true;
}

export function formatTimeForNotification(t: Time) {
    //get date
    // add 5 minutes to every time...
    const d = new Date()
    const updatedJSDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.hour, t.minute + 5);
    const dateUTC = DateTime.fromJSDate(updatedJSDate).toUTC();

    const minStr = dateUTC.minute < 10 ? ('0' + dateUTC.minute) : dateUTC.minute
    const hourStr = dateUTC.hour < 10 ? ('0' + dateUTC.hour) : dateUTC.hour
    return hourStr + ':' + minStr;
}

export function genCalendarVals() {
    const d = new Date();

    let dates = [];

    // //30 days before
    // for (let i = 30; i > 0; i--) {
    //     let date = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i);
    //     dates.push({
    //         day: date.getDate(),
    //         dayName: getDayName(date),
    //         month: date.getMonth(),
    //         monthShort: getMonthShort(date),
    //         year: date.getFullYear()
    //     })
    // }

    //30 days after
    for (let i = 0; i <= 30; i++) {
        let date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
        dates.push({
            day: date.getDate(),
            dayName: getDayName(date),
            monthShort: getMonthShort(date),
            month: date.getMonth(),
            year: date.getFullYear()
        })
    }

    return dates
}

export function renderSequenceValue(habit: HabitProps) {
    const { type } = habit.sequence;

    switch (type) {
        case SequenceType.weekly:
            return '(' + habit.sequence.value.sort((a, b) => a - b).map((day: any, index) => {
                return (index === 0 ? '' : ' ') + daysShort[day]
            }) + ')'
        case SequenceType.monthly:
            return ' (' + habit.sequence.value.sort((a, b) => a - b).map((day: any, index) => {
                return (index === 0 ? '' : ' ') + day
            }) + ')'
        default:
            return ''
    }
}

export function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function calcDaysInARow(ch: HabitProps['completedHabits']) {
    if (ch.length < 1) return 0;

    let count = 1;

    for (let i = 0; i < ch.length - 1; i++) {
        const d = ch[i].dateCompleted;
        const nD = ch[i + 1].dateCompleted;
        const dPrev = consecutiveTools.getNextDays(d, -1);

        if (consecutiveTools.datesAreOnSameDay(dPrev, nD)) {
            count++
        } else {
            break;
        }
    }

    return count
}