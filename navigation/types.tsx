import { HabitProps } from "../services/habits/types";

export type RootStackParamList = {
  Home: undefined;
  New: undefined;
  Habit: {
    habitDocId: HabitProps['docId'];
    activeDay: number;
  };
  Review: undefined;
  Settings: undefined;
  ReviewHistory: undefined;
  HabitHistory: undefined;
  Account: undefined;
  Privacy: undefined;
  Subscription: undefined;
};

export type BottomTabParamList = {
  Home: {
    screen: keyof HomeParamList
  }
};



export type HomeParamList = {
  HomeScreen: undefined;
  HabitScreen: undefined;
  ReviewScreen: undefined;
  NewScreen: undefined;
};
