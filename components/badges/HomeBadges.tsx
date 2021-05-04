import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { HabitProps } from '../../services/habits/types';
import Colors from '../../constants/Colors';
import { normalizeWidth } from '../../utils/styles';
import { AsapText } from '../StyledText';
import { ScrollView } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { dailyGoals } from '../../services/habits/utils/variables';
import HabitBadges from './HabitBadges';

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, 'Home'>

interface Props {
    habits: HabitProps[];
    navigation: HomeScreenNavProp;
}

const HomeBadges = ({ habits, navigation }: Props) => {

    const onNavigate = (docId: string) => {
        navigation.navigate('Habit', {
            habitDocId: docId,
            activeDay: new Date().getDate()
        })
    }

    return (
        <ScrollView style={styles.stars} horizontal={true}>
            {habits.filter((habit) => {
                const { goal, count } = habit.consecutive[Object.keys(habit.consecutive)[0]];
                return count.length >= goal
            }).map((habit) => <Pressable key={habit.docId} onPress={() => onNavigate(habit.docId)}><HabitBadges consecutive={habit.consecutive} size={normalizeWidth(10)} name={habit.name} home={true} /></Pressable>)}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    stars: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: normalizeWidth(20)
    },
    star: {
        alignItems: 'center',
        marginLeft: 5,
        width: normalizeWidth(10)
    },
    text: {
        fontSize: normalizeWidth(50)
    }
})

export default HomeBadges;