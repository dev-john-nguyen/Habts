import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import Home from '../screens/Home';
import { BottomTabParamList, HomeParamList } from './types';
import Habit from '../screens/Habit';
import Review from '../screens/Review';
import New from '../screens/New';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
    >
      <BottomTab.Screen
        name="Home"
        component={TabOneNavigator}
        options={({ route }) => ({
          tabBarVisible: getFocusedRouteNameFromRoute(route) === 'HomeScreen' ? true : false
        })}
      />
    </BottomTab.Navigator>
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<HomeParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        cardStyle: {
          backgroundColor: Colors.white,
        },
        headerStyle: {
          backgroundColor: Colors.white
        }
      }}
    >
      <TabOneStack.Screen
        name="HomeScreen"
        component={Home}
        options={{
          headerTitle: '',
          headerTransparent: true,
          cardStyle: {
            paddingTop: 50
          }
        }}
      />
      <TabOneStack.Screen
        name="HabitScreen"
        component={Habit}
        options={{
          headerTitle: '',
        }}
      />
      <TabOneStack.Screen
        name="ReviewScreen"
        component={Review}
        options={{
          headerTitle: ''
        }}
      />
      <TabOneStack.Screen
        name="NewScreen"
        component={New}
        options={{
          headerTitle: ''
        }}
      />
    </TabOneStack.Navigator>
  );
}
