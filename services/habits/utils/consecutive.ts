import { HabitProps, SequenceProps, SequenceType, ConsecutiveProps } from "../types";

class ConsecutiveTools {
    getSpecificDate(mm: number, dd: number, yyyy: number) {
        return new Date(yyyy, mm, dd);
    }

    getNextDays(d: Date, days: number) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
    }

    datesAreOnSameDay(first: Date, second: Date) {
        return (
            first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate()
        );
    }

    getFutureMonth(d: Date, monthAdd: number) {
        return new Date(d.getFullYear(), d.getMonth() + monthAdd, d.getDate());
    }

    getDiffBetweenDates(past: Date, future: Date) {
        let pastTime = new Date(
            past.getFullYear(),
            past.getMonth(),
            past.getDate()
        ).getTime();
        let futureTime = new Date(
            future.getFullYear(),
            future.getMonth(),
            future.getDate()
        ).getTime();
        let diff = futureTime - pastTime;
        return Math.ceil(diff / (1000 * 3600 * 24));
    }

    getFutureWeek(d: Date, weekAdd: number) {
        const totalDays = weekAdd * 7;
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + totalDays);
    }

    shouldReset(habit: HabitProps, targetDate: Date) {
        switch (habit.sequence.type) {
            case SequenceType.weekly:
                return this.shouldResetMonthlyOrWeekly(
                    habit.consecutive,
                    habit.sequence.value,
                    targetDate,
                    false
                );
            case SequenceType.monthly:
                return this.shouldResetMonthlyOrWeekly(
                    habit.consecutive,
                    habit.sequence.value,
                    targetDate,
                    true
                );
            case SequenceType.daily:
            default:
                return this.shouldResetDaily(habit.consecutive, targetDate);
        }
    }

    shouldResetMonthlyOrWeekly(consecutive: ConsecutiveProps, sequenceVals: SequenceProps['value'], targetDate: Date, monthly: boolean) {
        if (!sequenceVals.length) {
            return { invalid: "sequenceVals is empty" };
        }
        sequenceVals.sort((a, b) => a - b);

        const targetDateDay = monthly ? targetDate.getDate() : targetDate.getDay();

        const goalKeys = Object.keys(consecutive);

        for (let i = 0; i < goalKeys.length; i++) {
            const goalKey = goalKeys[i];
            const currentGoal = consecutive[goalKey];
            const { count, goal } = currentGoal;

            //find current goal
            if (count.length < goal || goal === 0) {
                //ensure date is a valid sequence
                const isValid = sequenceVals.findIndex((v) => v === targetDateDay);

                if (isValid < 0) {
                    return {
                        invalid:
                            "The target date doesn't fit any of the sequence values with zero in count"
                    };
                }

                //if count arr is empty push item into it
                if (count.length < 1) {
                    return { goalKey };
                }

                count.sort(
                    (a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime()
                );

                const lstComDate = count[count.length - 1].dateCompleted;

                const lstComDay = monthly ? lstComDate.getDate() : lstComDate.getDay();

                const lastDateIndex = sequenceVals.findIndex(
                    (val) => lstComDay === val
                );

                if (lastDateIndex < 0) {
                    return {
                        invalid: "The target date does not match any of the sequenceVals"
                    };
                }

                let nxtDate;
                let sqValIndex;
                //get the next sequence item in which the target date should be equal to
                if (lastDateIndex >= sequenceVals.length - 1) {
                    sqValIndex = 0;

                    //check if monthly logic
                    if (monthly) {
                        // get next month
                        nxtDate = new Date(
                            lstComDate.getFullYear(),
                            lstComDate.getMonth() + 1,
                            sequenceVals[sqValIndex]
                        );
                    } else {
                        //loop until get to next week
                        let stNxtWeek = this.getStartOfNextWeek(lstComDate);
                        //use the start of next week to get the day of which the first sequence val
                        let dayDiff = sequenceVals[sqValIndex] - stNxtWeek.getDay();
                        nxtDate = this.getNextDays(stNxtWeek, dayDiff);
                    }
                } else {
                    sqValIndex = lastDateIndex + 1;
                    //check if monthly logic
                    if (monthly) {
                        nxtDate = new Date(
                            lstComDate.getFullYear(),
                            lstComDate.getMonth(),
                            sequenceVals[sqValIndex]
                        );
                    } else {
                        let dayDiff = sequenceVals[sqValIndex] - lstComDay;
                        nxtDate = this.getNextDays(lstComDate, dayDiff);
                    }
                }

                if (!this.datesAreOnSameDay(nxtDate, targetDate)) {
                    //miss one, check if missed multiple
                    let secNxtDate;
                    let nxtSqValIndex = sqValIndex + 1;

                    if (nxtSqValIndex > sequenceVals.length - 1) {
                        //check if monthly logic
                        if (monthly) {
                            secNxtDate = new Date(
                                lstComDate.getFullYear(),
                                lstComDate.getMonth() + 1,
                                sequenceVals[0]
                            );
                        } else {
                            //miss one, check if missed multiple
                            let stNxtWeek = this.getStartOfNextWeek(nxtDate);

                            let dayDiff = sequenceVals[0] - stNxtWeek.getDay();
                            secNxtDate = this.getNextDays(stNxtWeek, dayDiff);
                        }
                    } else {
                        if (monthly) {
                            secNxtDate = new Date(
                                nxtDate.getFullYear(),
                                nxtDate.getMonth(),
                                sequenceVals[nxtSqValIndex]
                            );
                        } else {
                            let dayDiff = sequenceVals[nxtSqValIndex] - nxtDate.getDay();
                            secNxtDate = this.getNextDays(nxtDate, dayDiff);
                        }
                    }

                    if (!this.datesAreOnSameDay(secNxtDate, targetDate)) {
                        return { reset: true, goalKey };
                    }

                    return { warning: true, goalKey };
                }

                return { goalKey };
            }
        }

        return { invalid: "No goal key was found. This should never be called" };
    }

    shouldResetDaily(consecutive: ConsecutiveProps, date: Date) {
        //check the last completed item and ensure it fits sequence. If it doesn't match first sequence date
        //then it's a warning. check 2nd next and if it doesn't match. It's a miss.

        const goalKeys = Object.keys(consecutive);

        for (let i = 0; i < goalKeys.length; i++) {
            const goalKey = goalKeys[i];
            const currentGoal = consecutive[goalKey];
            const { count, goal } = currentGoal;

            if (count.length < goal || goal === 0) {
                //check if day already exists
                const duplicate = count.find((item) =>
                    this.datesAreOnSameDay(item.dateCompleted, date)
                );
                //duplicate item break from loop
                if (duplicate) break;

                //check consecutive
                //make sure there's an item
                if (count.length < 1) {
                    return { goalKey };
                } else {
                    //sort
                    count.sort(
                        (a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime()
                    );
                    //get last item
                    const { dateCompleted } = count[count.length - 1];
                    //check if new item is consecutive
                    //allow to miss 1 day
                    const nextDay = this.getNextDays(dateCompleted, 1);
                    const nextNextDay = this.getNextDays(dateCompleted, 2);

                    if (this.datesAreOnSameDay(nextDay, date)) {
                        return { goalKey };
                    }

                    if (this.datesAreOnSameDay(nextNextDay, date)) {
                        //reset
                        return { warning: true, goalKey };
                    }

                    //push
                    return { reset: true, goalKey };
                }
            }
        }
        return { invalid: "No goal key was found. This should never been called" };
    }

    getStartOfNextWeek(d: Date) {
        //loop until get to next week
        let stop = false;
        let count = 1;
        let stNxtWeek = new Date();

        while (!stop || count < 8) {
            let curD = this.getNextDays(d, count);
            if (curD.getDay() === 0) {
                stop = true;
                stNxtWeek = curD;
            }
            count++;
        }

        return stNxtWeek;
    }

    updateConsecutive(habit: HabitProps, targetDate: Date) {
        const { consecutive, sequence } = habit;

        let response;

        switch (sequence.type) {
            case SequenceType.weekly:
                response = consecutiveTools.shouldResetMonthlyOrWeekly(
                    habit.consecutive,
                    habit.sequence.value,
                    targetDate,
                    false
                );
                break;
            case SequenceType.monthly:
                response = consecutiveTools.shouldResetMonthlyOrWeekly(
                    habit.consecutive,
                    habit.sequence.value,
                    targetDate,
                    true
                );
                break;
            case SequenceType.daily:
            default:
                response = consecutiveTools.shouldResetDaily(
                    habit.consecutive,
                    targetDate
                );
        }

        const { invalid, goalKey, reset } = response;

        if (invalid) {
            console.log(invalid);
            return consecutive;
        }

        if (!goalKey) {
            console.log("not able to find goal key. Something wrong with logic");
            return consecutive;
        }

        if (reset) {
            consecutive[goalKey].count = [{ dateCompleted: targetDate }];
        } else {
            consecutive[goalKey].count = [
                ...consecutive[goalKey].count,
                { dateCompleted: targetDate }
            ];
        }

        return consecutive;
    }

    getCurrentConsecutiveTotal(consecutive: ConsecutiveProps) {
        let keys = Object.keys(consecutive);

        for (let i = 0; i < keys.length; i++) {
            const { count, goal } = consecutive[keys[i]];
            if (count.length < goal || goal === 0) {
                return count.length;
            }
        }
        return 0;
    }
}

export const consecutiveTools = new ConsecutiveTools();