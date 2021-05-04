export const dailyGoals = {
    one: {
        count: [],
        goal: 21,
        total: 21,
    },
    two: {
        count: [],
        goal: 20,
        total: 41
    },
    three: {
        count: [],
        goal: 20,
        total: 51
    },
    four: {
        count: [],
        goal: 26,
        total: 66
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
            goal: 3 * len,
            total: goal * 2
        },
        three: {
            count: [],
            goal: 3,
            total: goal * 3
        },
        four: {
            count: [],
            goal: 3,
            total: goal * 4
        }
    }
}