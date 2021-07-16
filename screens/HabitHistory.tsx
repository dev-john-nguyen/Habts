import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Animated, Easing, SafeAreaView } from 'react-native';
import { StyledText, StyledTextBold } from '../components/StyledText';
import Colors from '../constants/Colors';
import { HabitProps, HabitsProps } from '../services/habits/types';
import { ReducerStateProps } from '../services';
import { connect } from 'react-redux';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import HabitHeader from '../components/habit/Header';
import { emptyHabitEdit } from './utils';
import Tracker from '../components/habit/tracker';
import HabitBadges from '../components/badges/HabitBadges';
import { getDate } from '../utils/tools';



const HabitHistory = ({ archivedHabits }: { archivedHabits: HabitsProps['archivedHabits'] }) => {
    const [targetHabit, setTargetHabit] = useState<HabitProps>();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.filterContainer}>
                    <Animated.FlatList
                        style={styles.filterList}
                        contentContainerStyle={styles.filterListItems}
                        data={archivedHabits}
                        ListHeaderComponent={(
                            <View>
                                <StyledTextBold style={{
                                    fontSize: normalizeHeight(50),
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                    color: Colors.primary
                                }}>Habit History</StyledTextBold>
                                <View style={styles.underline} />
                            </View>
                        )}
                        ListEmptyComponent={(
                            <View style={[styles.filterItem, { backgroundColor: Colors.primary }]}>
                                <StyledText style={[styles.filterItemText, { color: Colors.white }]}>Empty</StyledText>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            let isSelected = false;
                            if (targetHabit) {
                                isSelected = item.docId === targetHabit.docId && true
                            }
                            return (
                                <Pressable onPress={() => {
                                    setTargetHabit(item)
                                }} style={[styles.filterItem, { backgroundColor: isSelected ? Colors.primary : Colors.white }]}>
                                    <StyledText style={[styles.filterItemText, { color: isSelected ? Colors.white : Colors.primary }]}>{item.name}</StyledText>
                                    <StyledText style={[styles.filterItemText, { color: isSelected ? Colors.white : Colors.primary, fontSize: normalizeHeight(80) }]}>{getDate(item.createdAt)} - {getDate(item.archivedAt ? item.archivedAt : new Date())}</StyledText>
                                </Pressable>
                            )
                        }}
                    />
                </View>
                <View style={styles.habitContainer}>
                    {targetHabit &&
                        <>
                            <HabitHeader
                                habit={targetHabit}
                                edit={false}
                                setHabitEdit={() => undefined}
                                habitEdit={emptyHabitEdit}
                            />
                            <HabitBadges consecutive={targetHabit.consecutive} />
                            <Tracker
                                sequence={targetHabit.sequence}
                                completedHabits={targetHabit.completedHabits}
                                startDate={targetHabit.createdAt}
                                endDate={targetHabit.archivedAt}
                                handleAddCompletedHabit={() => undefined}
                                consecutive={targetHabit.consecutive}
                            />
                            <View style={styles.dateContainer}>
                                <View style={{ flexDirection: 'row' }}>
                                    <StyledTextBold style={styles.dateText}>Created on: </StyledTextBold>
                                    <StyledText style={styles.dateText}>{getDate(targetHabit.createdAt)}</StyledText>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <StyledTextBold style={styles.dateText}>Archived on: </StyledTextBold>
                                    <StyledText style={styles.dateText}>{targetHabit.archivedAt ? getDate(targetHabit.archivedAt) : ''}</StyledText>
                                </View>
                            </View>
                        </>
                    }
                </View>
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: normalizeWidth(15),
        paddingTop: normalizeHeight(25)
    },
    habitContainer: {
        flex: 1,
        bottom: 0,
        width: '100%',
    },
    underline: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.grey,
        marginBottom: 10
    },
    filterList: {

    },
    filterListItems: {
        alignItems: 'stretch',
        padding: 10,
        paddingBottom: 10
    },
    filterItem: {
        padding: 10,
        backgroundColor: Colors.white,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    filterItemText: {
        fontSize: normalizeHeight(60),
        textTransform: 'capitalize',
        color: Colors.primary
    },
    filterContainer: {
        marginTop: 10,
        flex: .1,
        borderRadius: 10,
        backgroundColor: Colors.contentBg,
    },
    dateContainer: {
        marginTop: 5
    },
    dateText: {
        fontSize: normalizeWidth(30),
        color: Colors.primary
    }
})

const mapStateToProps = (state: ReducerStateProps) => ({
    archivedHabits: state.habits.archivedHabits
})

export default connect(mapStateToProps, {})(HabitHistory)