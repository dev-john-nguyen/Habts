import { HabitProps, SequenceProps } from "../types";

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

    getFutureWeek(d: Date, weekAdd: number) {
        const totalDays = weekAdd * 7;
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + totalDays);
    }

    calcDaily(consecutive: HabitProps['consecutive'], newCompletedHabit: Date) {
        //loop through current goal.
        //determine what current goal they are own
        //see if the latest matches sequence
        //if not then reset array
        //if so, push into array

        const goalKeys = Object.keys(consecutive);

        for (let i = 0; i < goalKeys.length; i++) {
            const currentGoal = consecutive[goalKeys[i]];
            const { count, goal } = currentGoal;
            //find current goal
            if (i == goalKeys.length - 1) {
                currentGoal.count.push({ dateCompleted: newCompletedHabit })
                break;
            }

            if (count.length < goal) {

                //check if day already exists
                const duplicate = count.find(item => this.datesAreOnSameDay(item.dateCompleted, newCompletedHabit))
                //duplicate item break from loop
                if (duplicate) break;

                //check consecutive
                //make sure there's an item
                if (count.length < 2) {
                    currentGoal.count.push({ dateCompleted: newCompletedHabit })
                } else {
                    //sort
                    count.sort((a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime())
                    //get last item
                    const { dateCompleted } = count[count.length - 1];
                    //check if new item is consecutive
                    //allow to miss 1 day
                    const nextDay = this.getNextDays(dateCompleted, 1);
                    const nextNextDay = this.getNextDays(dateCompleted, 2);

                    if (!this.datesAreOnSameDay(nextDay, newCompletedHabit)
                        && !this.datesAreOnSameDay(nextNextDay, newCompletedHabit)
                    ) {
                        //reset
                        currentGoal.count = [{ dateCompleted: newCompletedHabit }]
                    } else {
                        //push
                        currentGoal.count.push({ dateCompleted: newCompletedHabit })
                    }
                }
                break;
            }
        }

        return consecutive
    }

    calcMonthy(consecutive: HabitProps['consecutive'], sequenceVals: SequenceProps['value'], newCompletedHabit: Date) {
        sequenceVals.sort((a, b) => a - b);

        const goalKeys = Object.keys(consecutive);

        for (let i = 0; i < goalKeys.length; i++) {
            const currentGoal = consecutive[goalKeys[i]];
            const {
                count,
                goal
            } = currentGoal;

            if (i == goalKeys.length - 1) {
                currentGoal.count.push({ dateCompleted: newCompletedHabit })
                break;
            }

            //find current goal
            if (count.length < goal) {
                //check consecutive
                //make sure there's an item
                if (count.length < 2) {
                    currentGoal.count.push({
                        dateCompleted: newCompletedHabit
                    })
                } else {
                    //sort
                    count.sort((a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime())
                    //get last item

                    const lastCompletedDates = {
                        last: count[count.length - 1].dateCompleted,
                        secondLast: count[count.length - 2].dateCompleted
                    }


                    if (sequenceVals.length > 1) {
                        const lastDateIndex = sequenceVals.findIndex(val => lastCompletedDates.last.getDate() == val);

                        if (lastDateIndex < 0) {
                            //invalid sequence item
                            console.log('invalid item')
                            break;
                        }


                        let lastDateVal;

                        if (lastDateIndex >= sequenceVals.length - 1) {
                            lastDateVal = sequenceVals[0]
                        } else {
                            lastDateVal = sequenceVals[lastDateIndex + 1]
                        }

                        if (lastDateVal != newCompletedHabit.getDate()) {

                            let secondDateVal;

                            if (lastDateIndex >= sequenceVals.length - 2) {
                                secondDateVal = sequenceVals[1]
                            } else {
                                secondDateVal = sequenceVals[lastDateIndex + 2]
                            }

                            if (secondDateVal != newCompletedHabit.getDate()) {
                                //missed twice so reset count and break;
                                currentGoal.count = [{
                                    dateCompleted: newCompletedHabit
                                }];
                                break;
                            }


                        }

                    }


                    //check if date is within a 2 months
                    const twoNextMonths = this.getFutureMonth(lastCompletedDates.last, 2);

                    if (twoNextMonths < newCompletedHabit) {
                        currentGoal.count = [{
                            dateCompleted: newCompletedHabit
                        }];
                        break;
                    }

                    currentGoal.count.push({
                        dateCompleted: newCompletedHabit
                    })


                }
                break;
            }
        }

        return consecutive
    }

    calcWeekly(consecutive: HabitProps['consecutive'], sequenceVals: SequenceProps['value'], newCompletedHabit: Date) {

        sequenceVals.sort((a, b) => a - b);

        const goalKeys = Object.keys(consecutive);

        for (let i = 0; i < goalKeys.length; i++) {
            const currentGoal = consecutive[goalKeys[i]];
            const {
                count,
                goal
            } = currentGoal;

            if (i == goalKeys.length - 1) {
                currentGoal.count.push({ dateCompleted: newCompletedHabit })
                break;
            }

            //find current goal
            if (count.length < goal) {
                //check consecutive
                //make sure there's an item
                if (count.length < 2) {
                    currentGoal.count.push({
                        dateCompleted: newCompletedHabit
                    })
                } else {
                    //sort
                    count.sort((a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime())
                    //get last item

                    const lastCompletedDates = {
                        last: count[count.length - 1].dateCompleted,
                        secondLast: count[count.length - 2].dateCompleted
                    }


                    if (sequenceVals.length > 1) {
                        const lastDateIndex = sequenceVals.findIndex(val => lastCompletedDates.last.getDay() == val);

                        if (lastDateIndex < 0) {
                            //invalid sequence item
                            console.log('invalid item')
                            break;
                        }


                        let lastDateVal;

                        if (lastDateIndex >= sequenceVals.length - 1) {
                            lastDateVal = sequenceVals[0]
                        } else {
                            lastDateVal = sequenceVals[lastDateIndex + 1]
                        }

                        if (lastDateVal != newCompletedHabit.getDay()) {

                            let secondDateVal;

                            if (lastDateIndex >= sequenceVals.length - 2) {
                                secondDateVal = sequenceVals[1]
                            } else {
                                secondDateVal = sequenceVals[lastDateIndex + 2]
                            }

                            if (secondDateVal != newCompletedHabit.getDay()) {
                                //missed twice so reset count and break;
                                currentGoal.count = [{
                                    dateCompleted: newCompletedHabit
                                }];
                                break;
                            }


                        }

                    }

                    const nextTwoWeeks = this.getFutureWeek(lastCompletedDates.last, 2);

                    if (nextTwoWeeks < newCompletedHabit) {
                        currentGoal.count = [{
                            dateCompleted: newCompletedHabit
                        }];
                        break;
                    }


                    currentGoal.count.push({
                        dateCompleted: newCompletedHabit
                    })


                }
                break;
            }
        }

        return consecutive
    }

}

export const consecutiveTools = new ConsecutiveTools();