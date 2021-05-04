declare global {
    interface Date {
        toDate(): Date;
    }
}

export interface TimeDataProps {
    startTime: Time;
    endTime: Time;
    docId: string;
}

export interface Time {
    date: Date;
    hour: number;
    minute: number;
}

export interface HabitEditProps {
    docId: string;
    startTime: Time;
    endTime: Time;
    cue: string;
    locationDes: string;
    notes: string;
    notificationOn: boolean;
    notificationTime: Time & { totalMins: number };
}

export interface SequenceProps {
    type: SequenceType;
    value: Array<number>;
}

export enum WeekDay {
    mon = 'mon',
    tue = 'tue',
    wed = 'wed',
    thu = 'thu',
    fri = 'fri',
    sat = 'sat',
    sun = 'sun'
}

export enum SequenceType {
    daily = 'Daily',
    weekly = 'Weekly',
    monthly = 'Monthly',
}

export interface NewHabitProps {
    startTime: Time;
    endTime: Time;
    cue: string;
    locationDes: string;
    notes?: string;
    remove?: string;
    name: string;
    notificationOn: boolean;
    notificationTime: Time & { totalMins: number };
    sequence: SequenceProps;
}

export interface CompletedHabitsProps {
    dateCompleted: Date;
}

export interface ConsecutiveProps {
    [goalType: string]: {
        count: CompletedHabitsProps[];
        goal: number;
        total: number;
    }
}

export interface HabitProps {
    docId: string;
    startDate: Date;
    endDate: Date;
    startTime: Time;
    endTime: Time;
    cue: string;
    locationDes: string;
    notes: string;
    remove: string;
    name: string;
    totalCount: number;
    consecutive: ConsecutiveProps;
    archivedAt?: Date;
    notificationOn: boolean;
    notificationTime: Time & { totalMins: number };
    createdAt: Date;
    updatedAt: Date;
    completedHabits: CompletedHabitsProps[];
    sequence: SequenceProps;
}

export interface HabitsProps {
    habits: HabitProps[];
    archivedHabits: HabitProps[];
}

export interface HabitsActionsProps {
    addHabit: (habit: NewHabitProps) => Promise<void | boolean>;
    addCompletedHabit: (habitDocId: string) => Promise<void | undefined>;
    updateHabit: (updatedHabit: HabitEditProps) => Promise<void | undefined | boolean>;
    archiveHabit: (docId: string) => Promise<boolean>
}