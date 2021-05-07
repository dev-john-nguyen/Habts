import React, { useState, useRef } from 'react';
import { View, StyleSheet, Pressable, Animated, Easing, SafeAreaView } from 'react-native';
import { AsapText } from '../components/StyledText';
import Colors from '../constants/Colors';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { getDayName, getMonthShort } from '../utils/tools';
import { HabitProps, HabitsProps } from '../services/habits/types';
import { ReducerStateProps } from '../services';
import { connect } from 'react-redux';
import { normalizeHeight } from '../utils/styles';
import HabitHeader from '../components/habit/Header';
import { emptyHabitEdit } from './utils';



const HabitHistory = ({ archivedHabits }: { archivedHabits: HabitsProps['archivedHabits'] }) => {
    const currentDate = new Date()
    const [targetHabit, setTargetHabit] = useState<HabitProps>()
    const listWidth: any = useRef(new Animated.Value(0)).current;
    const listHeight: any = useRef(new Animated.Value(0)).current;

    const handleShowFilterList = () => {
        if (listWidth._value > 0) {
            Animated.parallel([
                Animated.timing(listWidth, {
                    useNativeDriver: false,
                    toValue: 0,
                    easing: Easing.inOut(Easing.circle),
                    duration: 500,
                    delay: 100
                }),
                Animated.timing(listHeight, {
                    useNativeDriver: false,
                    toValue: 0,
                    easing: Easing.inOut(Easing.circle),
                    duration: 500,
                })
            ]).start()
        } else {
            Animated.parallel([
                Animated.timing(listWidth, {
                    useNativeDriver: false,
                    toValue: normalizeHeight(4),
                    easing: Easing.inOut(Easing.circle),
                    duration: 500,
                }),
                Animated.timing(listHeight, {
                    useNativeDriver: false,
                    toValue: normalizeHeight(3),
                    easing: Easing.inOut(Easing.circle),
                    duration: 500,
                    delay: 100
                })
            ]).start()
        }
    }

    const renderFilterList = () => (
        <Animated.FlatList
            style={[styles.filterList, {
                width: listWidth,
                height: listHeight
            }
            ]}
            contentContainerStyle={styles.filterListItems}
            data={[...archivedHabits].reverse()}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <Pressable onPress={() => {
                    setTargetHabit(item)
                    handleShowFilterList()
                }} style={styles.filterItem}>
                    <AsapText style={styles.filterItemText}>{item.name}</AsapText>
                </Pressable>
            )}
        />
    )

    const renderHeader = () => {
        const createdAt: Date = targetHabit ? targetHabit.createdAt : currentDate;
        const archivedAt: Date = targetHabit && targetHabit.archivedAt ? targetHabit.archivedAt : currentDate

        return (
            <View style={styles.filterContainer}>
                <View>
                    <FontAwesome name="calendar" size={normalizeHeight(25)} color={Colors.white} style={{ zIndex: 10 }} onPress={handleShowFilterList} />
                    {renderFilterList()}
                </View>
                <View style={styles.datesContainer}>
                    <View style={styles.date}>
                        <AsapText style={styles.dateDay}>{createdAt.getDate()}</AsapText>
                        <View>
                            <AsapText style={styles.dateMonYr}>{getDayName(createdAt)}</AsapText>
                            <AsapText style={styles.dateMonYr}>{getMonthShort(createdAt)} {createdAt.getFullYear()}</AsapText>
                        </View>
                    </View>
                    <Entypo name="arrow-long-right" size={normalizeHeight(40)} color={Colors.white} />
                    <View style={styles.date}>
                        <AsapText style={styles.dateDay}>{archivedAt.getDate()}</AsapText>
                        <View>
                            <AsapText style={styles.dateMonYr}>{getDayName(archivedAt)}</AsapText>
                            <AsapText style={styles.dateMonYr}>{getMonthShort(archivedAt)} {archivedAt.getFullYear()}</AsapText>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <AsapText style={styles.headerSubText}>Archived</AsapText>
                    <AsapText style={styles.headerTitle}>Habit</AsapText>
                </View>
                {renderHeader()}
                <View style={styles.habitContainer}>
                    {targetHabit && <HabitHeader
                        habit={targetHabit}
                        edit={false}
                        setHabitEdit={() => undefined}
                        habitEdit={emptyHabitEdit}
                    />}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
    },
    habitContainer: {
        flex: 1,
        bottom: 0,
        width: '100%',
    },
    emptyText: {
        alignSelf: 'center',
        fontSize: normalizeHeight(40),
        color: Colors.black
    },
    filterList: {
        position: 'absolute',
        top: -10,
        left: -10,
        backgroundColor: Colors.secondary,
        borderRadius: 20,
        paddingTop: 0
    },
    filterListItems: {
        flexDirection: 'column-reverse',
        alignItems: 'stretch',
        padding: 20,
        marginTop: 30,
        paddingBottom: 40
    },
    filterItem: {
        padding: 10,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center'
    },
    filterItemText: {
        fontSize: normalizeHeight(50),
        color: Colors.white
    },
    edit: {
        position: 'absolute',
        top: -20,
        right: -10
    },
    header: {
        flex: .1,
        alignSelf: 'center'
    },
    headerSubText: {
        fontSize: normalizeHeight(40),
        color: Colors.red,
        marginRight: 10,
        left: 5
    },
    headerTitle: {
        fontSize: normalizeHeight(15),
        color: Colors.white,
        top: -10
    },
    filterContainer: {
        flex: .2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    },
    history: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        zIndex: -10
    },
    date: {
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    dateDay: {
        fontSize: normalizeHeight(25),
        color: Colors.white,
        marginRight: 10
    },
    dateMonYr: {
        fontSize: normalizeHeight(65),
        color: Colors.white
    },
})

const mapStateToProps = (state: ReducerStateProps) => ({
    archivedHabits: state.habits.archivedHabits
})

export default connect(mapStateToProps, {})(HabitHistory)