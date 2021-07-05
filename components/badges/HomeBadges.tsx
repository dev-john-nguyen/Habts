import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { HabitProps } from '../../services/habits/types';
import { normalizeWidth, normalizeHeight } from '../../utils/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import HabitBadges from './HabitBadges';
import { AsapText, AsapTextBold } from '../StyledText';
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
            <HabitBadges consecutive={habit.consecutive} size={normalizeWidth(7)} name={habit.name} home={true} />
        </Pressable>
    ))

    return (
        <View style={styles.container}>
            <View style={[styles.background, Colors.boxShadowLight]}>
                <AsapTextBold style={styles.title}>Awards</AsapTextBold>
                <View style={styles.borderBottom} />
            </View>
            <ScrollView horizontal={true}>
                {
                    mappedBadges.length ? mappedBadges :
                        <View style={styles.infoContainer}>
                            <Entypo name="info-with-circle" size={normalizeHeight(60)} color={Colors.white} />
                            <AsapText style={styles.text}>Badges are shown here</AsapText>
                        </View>
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: normalizeWidth(40),
        padding: 5,
        alignItems: 'center',
        top: normalizeHeight(30)
    },
    borderBottom: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.lightGrey,
        marginTop: 5
    },
    background: {
        backgroundColor: Colors.white,
        padding: 5,
        paddingTop: 10,
        position: 'absolute',
        height: '120%',
        width: '100%',
        top: -normalizeHeight(30),
        borderRadius: 10,
    },
    titleContainer: {
        top: 10,
        borderBottomColor: Colors.lightGrey,
        borderBottomWidth: 1,
        paddingBottom: 2
    },
    title: {
        fontSize: normalizeWidth(30),
        color: Colors.primary,
        textAlign: 'center',
    },
    star: {
        alignItems: 'center'
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