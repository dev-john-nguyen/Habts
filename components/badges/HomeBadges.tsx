import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { HabitProps } from '../../services/habits/types';
import { normalizeWidth, normalizeHeight } from '../../utils/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import HabitBadges from './HabitBadges';
import { AsapText } from '../StyledText';
import Colors from '../../constants/Colors';
import { Entypo } from '@expo/vector-icons';

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

    const mappedBadges = habits.filter((habit) => {
        const { goal, count } = habit.consecutive[Object.keys(habit.consecutive)[0]];
        return count.length >= goal
    }).map((habit) => (
        <Pressable key={habit.docId} onPress={() => onNavigate(habit.docId)} style={styles.star}>
            <HabitBadges consecutive={habit.consecutive} size={normalizeHeight(20)} name={habit.name} home={true} />
        </Pressable>
    ))

    return (
        <ScrollView style={styles.stars} horizontal={true}>
            {
                mappedBadges.length ? mappedBadges :
                    <View style={styles.infoContainer}>
                        <Entypo name="info-with-circle" size={normalizeHeight(60)} color={Colors.white} />
                        <AsapText style={styles.text}>Badges are shown here</AsapText>
                    </View>
            }
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
        width: normalizeHeight(19)
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontSize: normalizeHeight(60),
        color: Colors.white,
        marginLeft: 5
    }
})

export default HomeBadges;