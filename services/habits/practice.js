function getItems() {
    let len = 5;
    let count = 0;
    const items = [];
    let itemObj = {
        one: [],
        two: [],
        three: [],
        four: []
    }

    while (count < len) {
        const date = new Date(2020, 01, 01)
        var yesterday = new Date(date.getTime());
        let numDate;
        let newDate;

        numDate = yesterday.setMonth(date.getMonth() + count);

        let addDays = 0;

        new Array(3).fill('dfas').forEach(() => {
            numDate = yesterday.setDate(date.getDate() + addDays);
            newDate = new Date(numDate);
            items.push({
                dateCompleted: newDate
            })
            addDays = addDays + 5
        })


        count++
    }

    return items
}

const items = getItems();

const otherGoals = {
    one: {
        count: 3
    },
    two: {
        count: 6
    },
    three: {
        count: 9
    },
    four: {
        count: 12
    },
    five: {
        count: 0
    }
}


const sequenceVal = {
    type: 'monthly',
    value: [1, 6, 11, 10, 20, 21]
}

function datesAreOnSameDay(first, second) {
    return first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();
}

function compareMonthDates(curDate, nextDate, daysToAdd) {
    const formatCurDate = new Date(curDate.getFullYear(), curDate.getMonth() + daysToAdd, curDate.getDate());
    const formatNextDate = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());
    return datesAreOnSameDay(formatNextDate, formatCurDate)
}

function calcMonthly(completedHabits, sequenceVals) {
    //be aware that this doesn't check for year errors
    if (completedHabits.length < 1) return [];
    if (completedHabits.length == 1) return [completedHabits[0]];

    if (!sequenceVals) return [];

    sequenceVals.sort((a, b) => a - b);
    completedHabits = completedHabits.sort((a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime())

    console.log(completedHabits)

    const consecutiveGoals = {
        one: {
            goal: 3,
            count: []
        },
        two: {
            goal: 6,
            count: []
        },
        three: {
            goal: 9,
            count: []
        },
        four: {
            goal: 12,
            count: []
        },
        five: {
            goal: 0,
            count: []
        }
    }

    const goalKeys = Object.keys(consecutiveGoals);
    let goalIndex = 0;
    let currentGoal;
    let currentMonth = 0;
    let indexOfMonth = 0;

    for (let i = 0; i < completedHabits.length; i++) {
        let targetHabit = completedHabits[i];

        if (i == 0) {
            let foundIndex = sequenceVals.findIndex(val => targetHabit.dateCompleted.getDate() == val);

            if (foundIndex < 0) {
                break;
            }

            indexOfMonth = foundIndex;
        }

        if (i == 0) {
            consecutiveGoals.five.count.push(targetHabit);
            currentMonth = targetHabit.dateCompleted.getMonth();
        } else {
            let targetDay = sequenceVals[indexOfMonth];

            if (targetHabit.dateCompleted.getDate() != targetDay || currentMonth != targetHabit.dateCompleted.getMonth()) {
                //increment indexOf month
                if (indexOfMonth < sequenceVals.length - 1) {
                    indexOfMonth++
                } else {
                    indexOfMonth = 0;
                    currentMonth++
                }

                //get next target date
                let nextTargetDay = sequenceVals[indexOfMonth];
                console.log(targetDay, nextTargetDay)

                if (targetHabit.dateCompleted.getDate() != nextTargetDay || currentMonth != targetHabit.dateCompleted.getMonth()) {
                    console.log('miss')
                    //missed two so reset
                    //empty store
                    consecutiveGoals.five.count = []
                    //reset indexOfMonth
                    let foundIndex = sequenceVals.findIndex(val => targetHabit.dateCompleted.getDate() == val);
                    if (foundIndex < 0) break;
                    indexOfMonth = foundIndex;
                    currentMonth = targetHabit.dateCompleted.getMonth();
                }


                consecutiveGoals.five.count.push(targetHabit)
            } else {
                consecutiveGoals.five.count.push(targetHabit)
            }

        }


        if (indexOfMonth < sequenceVals.length - 1) {
            indexOfMonth++
        } else {
            indexOfMonth = 0;
            currentMonth++
        }

    }

    return consecutiveGoals;
}

function calcMonthlyConsecutiveWithGoalObj(completedHabits, sequenceVals) {
    if (completedHabits.length < 1) return [];
    if (completedHabits.length == 1) return [completedHabits[0]];

    let count = [];
    let indexOfMonth = 0;

    if (!sequenceVals) return count;

    sequenceVals.sort((a, b) => a - b);
    completedHabits = completedHabits.sort((a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime()).filter(function (item, pos, ary) {
        return !pos || !compareMonthDates(item.dateCompleted, ary[pos > 0 ? pos - 1 : 0].dateCompleted, 0)
    });

    const consecutiveGoals = {
        one: {
            goal: 3,
            count: []
        },
        two: {
            goal: 6,
            count: []
        },
        three: {
            goal: 9,
            count: []
        },
        four: {
            goal: 12,
            count: []
        },
        five: {
            goal: 0,
            count: []
        }
    }

    const goalKeys = Object.keys(consecutiveGoals);
    let goalIndex = 0;
    let currentGoal;
    let monthIndex = 0;

    for (let i = 0; i < completedHabits.length; i++) {
        let targetHabit = completedHabits[i];

        if (i == 0) {
            currentGoal = goalKeys[goalIndex];
            consecutiveGoals[currentGoal].count.push(targetHabit);

            let foundIndex = sequenceVals.findIndex(val => targetHabit.dateCompleted.getDate() == val);

            if (foundIndex < 0) {
                break;
            }

            indexOfMonth = foundIndex;
        } else {

            let nextHabit = completedHabits[i + 1];


            if (nextHabit && !compareMonthDates(targetHabit.dateCompleted, nextHabit.dateCompleted, 1)) {
                let nextNextHabit = completedHabits[i + 2];
                if (!nextNextHabit) break;
                if (!compareMonthDates(targetHabit.dateCompleted, nextNextHabit.dateCompleted, 1)) {
                    consecutiveGoals[currentGoal].count = [];
                    continue;
                }

            }

            if (consecutiveGoals[currentGoal].goal < 1 || consecutiveGoals[currentGoal].goal > consecutiveGoals[currentGoal].count.length) {
                consecutiveGoals[currentGoal].count.push(targetHabit);
            } else {
                //means move to next goal
                if (goalIndex < goalKeys.length - 1) {
                    goalIndex++
                    currentGoal = goalKeys[goalIndex];
                }

                consecutiveGoals[currentGoal].count.push(targetHabit);
            }


        }
    }

    return consecutiveGoals;
}


function calcMonthlyConsecutive(completedHabits, sequenceVals) {
    if (completedHabits.length < 1) return [];
    if (completedHabits.length == 1) return [completedHabits[0]];

    let count = [];
    let indexOfMonth = 0;

    if (!sequenceVals) return count;

    sequenceVals.sort((a, b) => a - b);
    completedHabits.sort((a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime())

    let miss = 1;
    let prevHabit = {};

    for (let i = 0; i < completedHabits.length; i++) {
        let targetDate = completedHabits[i].dateCompleted;
        let loopMiss = miss;

        if (i == 0) {
            let foundIndex = sequenceVals.findIndex(val => targetDate.getDate() == val);
            if (foundIndex < 0) {
                break;
            }
            indexOfMonth = foundIndex;
        }

        if (i > 0 && !compareMonthDates(targetDate, prevHabit.dateCompleted, miss)) {
            if (miss > 1) {
                count = revertToPrevOtherGoals(count)
                console.log(count)
                miss = 1
                prevHabit = completedHabits[i]
            } else {
                miss++
            }
        } else {
            prevHabit = completedHabits[i]
        }

        if (loopMiss == miss && miss > 1) {
            miss = 1
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

function revertToPrevOtherGoals(countedHabits) {
    const completeLen = countedHabits.length;

    if (completeLen >= otherGoals.four.count) {
        return [...countedHabits.splice((completeLen - otherGoals.four.count), otherGoals.four.count)]
    }

    if (completeLen >= otherGoals.three.count) {
        return [...countedHabits.splice((completeLen - otherGoals.three.count), otherGoals.three.count)]
    }

    if (completeLen >= otherGoals.two.count) {
        return [...countedHabits.splice((completeLen - otherGoals.two.count), otherGoals.two.count)]
    }

    if (completeLen >= otherGoals.one.count) {
        return [...countedHabits.splice((completeLen - otherGoals.one.count), otherGoals.one.count)]
    }

    return []
}

console.log(calcMonthly(items, sequenceVal.value))
