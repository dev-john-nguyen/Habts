import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator, StackCardInterpolationProps, TransitionSpecs } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, Animated } from 'react-native';
import { RootStackParamList } from './types';
import LinkingConfiguration from './LinkingConfiguration';
import New from '../screens/New';
import Habit from '../screens/Habit';
import Review from '../screens/Review';
import Home from '../screens/Home';
import Colors from '../constants/Colors';
import Settings from '../screens/settings/Settings';
import ReviewHistory from '../screens/ReviewHistory';
import HabitHistory from '../screens/HabitHistory';
import Account from '../screens/settings/Account';
import Privacy from '../screens/settings/Privacy';
import Subscription from '../screens/settings/Subscription';
import ContactUs from '../screens/settings/Contact';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: 'transparent'
        }
      }}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

const cardAnimation = ({ current, next, layouts }: StackCardInterpolationProps) => ({
  cardStyle: {
    transform: [
      {
        translateX: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [layouts.screen.width, 0]
        })
      },
      {
        translateX: next
          ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -layouts.screen.width]
          })
          : 1
      }
    ]
  },
  overlayStyle: {
    opacity: current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5]
    })
  }
});

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        gestureDirection: 'horizontal',
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec
        },
        cardStyleInterpolator: cardAnimation,
        headerTitle: '',
        headerTransparent: true,
        headerTintColor: Colors.white
      }}
      mode='modal'
    >
      <Stack.Screen name="Home" component={Home} options={{ headerTitle: '', headerShown: false }} />
      <Stack.Screen name="New" component={New} />
      <Stack.Screen name="Habit" component={Habit} options={{ headerTitle: '', headerTintColor: Colors.tertiary }} />
      <Stack.Screen name="Review" component={Review} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="ReviewHistory" component={ReviewHistory} />
      <Stack.Screen name="HabitHistory" component={HabitHistory} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
    </Stack.Navigator>
  );
}
