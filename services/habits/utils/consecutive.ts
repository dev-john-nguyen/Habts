import { HabitProps, SequenceProps, CompletedHabitsProps, SequenceType, ConsecutiveProps } from "../types";

class ConsecutiveTools {

    getNextDays(d: Date, days: number) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
    }

    datesAreOnSameDay(first: Date, second: Date) {
        return first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate();
    }

    getFutureMonth(d: Date, monthAdd: number) {
        return new Date(d.getFullYear(), d.getMonth() + monthAdd, d.getDate());
    }

    getDiffBetweenDates(past: Date, future: Date) {
        let pastTime = new Date(past.getFullYear(), past.getMonth(), past.getDate()).getTime();
        let futureTime = new Date(future.getFullYear(), future.getMonth(), future.getDate()).getTime();
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
                return this.shouldResetWeekly(habit.consecutive, habit.sequence.value, targetDate);
            case SequenceType.monthly:
                return this.shouldResetMonthly(habit.consecutive, habit.sequence.value, targetDate)
            case SequenceType.daily:
            default:
                return this.shouldResetDaily(habit.consecutive, targetDate);
        }
    }

    shouldResetMonthly(consecutive: HabitProps['consecutive'], sequenceVals: SequenceProps['value'], targetDate: Date) {
        sequenceVals.sort((a, b) => a - b);

        const targetDateNum = targetDate.getDate()

        const goalKeys = Object.keys(consecutive);

        for (let i = 0; i < goalKeys.length; i++) {
            const goalKey = goalKeys[i];
            const currentGoal = consecutive[goalKey];
            const {
                count,
                goal
            } = currentGoal;

            //find current goal
            if (count.length < goal || goal === 0) {
                //check consecutive
                //make sure there's an item
                if (count.length < 1) {
                    return { goalKey }
                } else {
                    //sort
                    count.sort((a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime())
                    //get last item

                    const lastCompletedDate = count[count.length - 1].dateCompleted;

                    if (sequenceVals.length > 1) {
                        const lastDateIndex = sequenceVals.findIndex(val => lastCompletedDate.getDate() == val);

                        if (lastDateIndex < 0) {
                            //invalid sequence item
                            return { invalid: true }
                        }

                        let lastDateVal;
                        //get the next sequence item in which the target date should be equal to
                        if (lastDateIndex >= sequenceVals.length - 1) {
                            //last item so go to first
                            lastDateVal = sequenceVals[0]
                        } else {
                            lastDateVal = sequenceVals[lastDateIndex + 1];
                        }


                        if (lastDateVal !== targetDateNum) {
                            //miss one, check if missed multiple 
                            let secondLastVal;

                            if (lastDateIndex >= sequenceVals.length - 2) {
                                secondLastVal = sequenceVals[1]
                            } else {
                                secondLastVal = sequenceVals[lastDateIndex + 2];
                            }

                            if (secondLastVal !== targetDateNum) {
                                return { reset: true, goalKey }
                            }

                            return { warning: true, goalKey }
                        }
                    }

                    //theres only one sequence item, so check if equal and if within 2 months since allowed one miss;
                    if (sequenceVals[0] !== targetDateNum) {
                        //this indicates there is invalid taget date
                        console.log('invalid')
                        return { invalid: true }
                    }

                    const diffInDays = this.getDiffBetweenDates(lastCompletedDate, targetDate);

                    if (diffInDays <= 32) {
                        //it's been one month, we good
                        return { goalKey }
                    }

                    if (diffInDays <= 64) {
                        //miss one month, warning
                        return { warning: true, goalKey }
                    }

                    return { reset: true, goalKey }
                }
            }
        }

        return { invalid: true }
    }

    shouldResetDaily(consecutive: HabitProps['consecutive'], date: Date) {
        //check the last completed item and ensure it fits sequence. If it doesn't match first sequence date
        //then it's a warning. check 2nd next and if it doesn't match. It's a miss.

        const goalKeys = Object.keys(consecutive);

        for (let i = 0; i < goalKeys.length; i++) {
            const goalKey = goalKeys[i];
            const currentGoal = consecutive[goalKey];
            const { count, goal } = currentGoal;

            if (count.length < goal || goal === 0) {

                //check if day already exists
                const duplicate = count.find(item => this.datesAreOnSameDay(item.dateCompleted, date))
                //duplicate item break from loop
                if (duplicate) break;

                //check consecutive
                //make sure there's an item
                if (count.length < 1) {
                    return { goalKey }
                } else {
                    //sort
                    count.sort((a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime())
                    //get last item
                    const { dateCompleted } = count[count.length - 1];
                    //check if new item is consecutive
                    //allow to miss 1 day
                    const nextDay = this.getNextDays(dateCompleted, 1);
                    const nextNextDay = this.getNextDays(dateCompleted, 2);

                    if (this.datesAreOnSameDay(nextDay, date)) {
                        return { goalKey }
                    }

                    if (!this.datesAreOnSameDay(nextNextDay, date)) {
                        //reset
                        return { warning: true, goalKey }
                    }

                    //push
                    return { reset: true, goalKey };

                }
                break;
            }
        }
        return { invalid: true }
    }

    shouldResetWeekly(consecutive: HabitProps['consecutive'], sequenceVals: SequenceProps['value'], targetDate: Date) {
        sequenceVals.sort((a, b) => a - b);
        const targetDateNum = targetDate.getDate()
        const goalKeys = Object.keys(consecutive);

        for (let i = 0; i < goalKeys.length; i++) {
            const goalKey = goalKeys[i]
            const currentGoal = consecutive[goalKey];
            const {
                count,
                goal
            } = currentGoal;

            //find current goal
            if (count.length < goal || goal === 0) {
                //check consecutive
                //make sure there's an item
                if (count.length < 1) {
                    return { goalKey }
                } else {
                    //sort
                    count.sort((a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime())
                    //get last item

                    const lastCompletedDate = count[count.length - 1].dateCompleted;


                    if (sequenceVals.length > 1) {
                        const lastDateIndex = sequenceVals.findIndex(val => lastCompletedDate.getDate() == val);

                        if (lastDateIndex < 0) {
                            //invalid sequence item
                            return { invalid: true }
                        }

                        let lastDateVal;
                        //get the next sequence item in which the target date should be equal to
                        if (lastDateIndex >= sequenceVals.length - 1) {
                            //last item so go to first
                            lastDateVal = sequenceVals[0]
                        } else {
                            lastDateVal = sequenceVals[lastDateIndex + 1];
                        }


                        if (lastDateVal !== targetDateNum) {
                            //miss one, check if missed multiple 
                            let secondLastVal;

                            if (lastDateIndex >= sequenceVals.length - 2) {
                                secondLastVal = sequenceVals[1]
                            } else {
                                secondLastVal = sequenceVals[lastDateIndex + 2];
                            }

                            if (secondLastVal !== targetDateNum) {
                                return { reset: true, goalKey }
                            }

                            return { warning: true, goalKey }
                        }
                    }

                    if (sequenceVals[0] !== targetDateNum) {
                        console.log('invalid')
                        return { invalid: true }
                    }

                    const diffInDays = this.getDiffBetweenDates(lastCompletedDate, targetDate);

                    if (diffInDays <= 7) {
                        //it's been one week, we good
                        return { goalKey }
                    }

                    if (diffInDays <= 14) {
                        //it's been two weeks, display warning
                        return { warning: true, goalKey }
                    }

                    //reset
                    return { reset: true, goalKey }
                }
                break;
            }
        }

        return { invalid: true }
    }

    updateConsecutive(habit: HabitProps, targetDate: Date) {
        const { consecutive, sequence } = habit;

        let response;

        switch (sequence.type) {
            case SequenceType.weekly:
                response = consecutiveTools.shouldResetWeekly(habit.consecutive, habit.sequence.value, targetDate);
                break;
            case SequenceType.monthly:
                response = consecutiveTools.shouldResetMonthly(habit.consecutive, habit.sequence.value, targetDate);
                break;
            case SequenceType.daily:
            default:
                response = consecutiveTools.shouldResetDaily(habit.consecutive, targetDate);
        }

        const { invalid, goalKey, reset } = response;

        if (invalid) {
            console.log('invalid. Something wrong with logic or date')
            return consecutive;
        }

        if (!goalKey) {
            console.log('not able to find goal key. Something wrong with logic')
            return consecutive;
        }

        if (reset) {
            consecutive[goalKey].count = [{ dateCompleted: targetDate }]
        } else {
            consecutive[goalKey].count = [...consecutive[goalKey].count, { dateCompleted: targetDate }]
        }

        return consecutive;
    }

    getCurrentConsecutiveTotal(consecutive: HabitProps['consecutive']) {
        let keys = Object.keys(consecutive)

        for (let i = 0; i < keys.length; i++) {
            const { count, goal } = consecutive[keys[i]];
            if (count.length < goal || goal === 0) {
                return count.length;
            }
        }
        return 0
    }
}

export const consecutiveTools = new ConsecutiveTools();