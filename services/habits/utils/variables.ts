export function dailyGoals() {
    return {
        one: {
            count: [],
            goal: 21,
            total: 21,
        },
        two: {
            count: [],
            goal: 15,
            total: 36
        },
        three: {
            count: [],
            goal: 15,
            total: 51
        },
        four: {
            count: [],
            goal: 15,
            total: 66
        },
        five: {
            count: [],
            goal: 0,
            total: 0
        }
    }
}

//calc other goals depending on how many sequence values there are

export function otherGoals(len: number) {

    const goal = 3 * len;

    return {
        one: {
            count: [],
            goal: goal,
            total: goal
        },
        two: {
            count: [],
            goal: goal,
            total: goal * 2
        },
        three: {
            count: [],
            goal: goal,
            total: goal * 3
        },
        four: {
            count: [],
            goal: goal,
            total: goal * 4
        },
        five: {
            count: [],
            goal: 0,
            total: 0
        }
    }
}