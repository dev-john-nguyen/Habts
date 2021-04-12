export const listOfQuotes = [
    'Good Job!',
    'Another One!',
    'Nice!',
    'Key Trucking!'
]

export const loginWords = [
    'improve',
    'consistent',
    'best',
    'growth',
    'progress',
    'daily',
    'habits',
    'goals'
]

export function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}