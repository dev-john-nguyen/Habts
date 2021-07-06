import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import Colors from '../constants/Colors';
import { Entypo } from '@expo/vector-icons';
import Layout from '../constants/Layout';
import { BottomTabParamList, RootStackParamList } from '../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import HabitHeader from '../components/habit/Header';
import { RouteProp } from '@react-navigation/native';
import { connect } from 'react-redux';
import { ReducerStateProps } from '../services';
import { HabitProps, HabitsActionsProps, HabitEditProps, CompletedHabitsProps } from '../services/habits/types';
import { setBanner } from '../services/banner/actions';
import { BannerActionsProps } from '../services/banner/types';
import { addCompletedHabit, updateHabit, archiveHabit } from '../services/habits/actions';
import Modal from '../components/habit/ArchiveModal';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import CongratsStar from '../components/congrats/Star';
import { cloneDeep, isEqual } from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';
import Tracker from '../components/habit/tracker';
import { AsapTextBold, AsapText } from '../components/StyledText';

type HabitComNavProps = StackNavigationProp<BottomTabParamList, 'Home'>
type HabitComRouteProps = RouteProp<RootStackParamList, 'Habit'>

interface HabitComProps {
    navigation: HabitComNavProps;
    route: HabitComRouteProps;
    habits: HabitProps[];
    setBanner: BannerActionsProps['setBanner'];
    addCompletedHabit: HabitsActionsProps['addCompletedHabit'];
    updateHabit: HabitsActionsProps['updateHabit'];
    archiveHabit: HabitsActionsProps['archiveHabit'];
}

const HabitCom = ({ navigation, route, habits, setBanner, addCompletedHabit, updateHabit, archiveHabit }: HabitComProps) => {
    const [habit, setHabit] = useState<HabitProps>();
    const [consecCompletedHabits, setConsecCompletedHabits] = useState<CompletedHabitsProps[]>([])
    const [habitEdit, setHabitEdit] = useState<HabitEditProps>();
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [resetBalls, setResetBalls] = useState(0);
    const [congratsIndex, setCongratsIndex] = useState<number>();
    const [showInfo, setShowInfo] = useState(false);
    const mount = useRef(false);

    useLayoutEffect(() => {
        mount.current = true;

        navigation.setOptions({
            headerRight: () => {
                if (edit) {
                    return (
                        <View style={{ flexDirection: 'row' }}>
                            {
                                loading ?
                                    <ActivityIndicator size="small" color={Colors.white} style={{ marginRight: 5 }} />
                                    :
                                    <>
                                        <Entypo name="save" size={normalizeHeight(30)} color={Colors.white} style={{ marginRight: 5 }} onPress={handleSaveEditHabit} />
                                        <Entypo name="cross" size={normalizeHeight(30)} color={Colors.white} style={{ marginRight: 5 }} onPress={() => setEdit(false)} />
                                    </>
                            }
                        </View>
                    )
                } else {
                    return <Entypo name="pencil" size={normalizeHeight(30)} color={Colors.white} style={{ marginRight: 5 }} onPress={() => setEdit(true)} />
                }
            },
            headerTitle: () => {
                if (edit) {
                    return (
                        <View>
                            <Entypo name="archive" size={normalizeHeight(30)} color={Colors.red} onPress={onArchivePress} style={{ zIndex: 100 }} />
                            <Modal headerText='Are you sure? Once archived, you cannot undo.' onModalResponse={onArchiveModalResponse} showModal={showModal} loading={loading} />
                        </View>
                    )
                }
            }
        })

        return () => {
            mount.current = false;
        }
    }, [edit, habitEdit, loading, showModal])

    const handleSaveEditHabit = () => {
        if (habitEdit) {
            setLoading(true);
            updateHabit(habitEdit)
                .then(() => {
                    if (mount.current) {
                        setEdit(false)
                        setLoading(false);
                    }
                })
        } else {
            setEdit(false)
        }
    }

    const onArchivePress = () => setShowModal(showModal ? false : true)

    const onArchiveModalResponse = () => {
        if (habitEdit) {
            setLoading(true);
            archiveHabit(habitEdit.docId)
                .then(() => {
                    mount.current && setLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                    mount.current && setLoading(false)
                })
        } else {
            setShowModal(false)
        }
    }

    useEffect(() => {
        if (!route.params.habitDocId || !route.params.activeDay) {
            setBanner('error', "Sorry, couldn't found the habit id.");
            navigation.goBack()
            return;
        };

        const { habitDocId } = route.params;
        const foundHabit = habits.find((item) => item.docId === habitDocId);

        if (!foundHabit) {
            navigation.goBack();
            return;
        }

        if (habit) {
            checkResetConsecutive(habit.consecutive, foundHabit.consecutive);
        }

        setHabit(cloneDeep(foundHabit));

        setConsecCompletedHabits(getTotalConsecutive(foundHabit.consecutive));

        setHabitEdit({
            docId: foundHabit.docId,
            startTime: foundHabit.startTime,
            endTime: foundHabit.endTime,
            cue: foundHabit.cue,
            locationDes: foundHabit.locationDes,
            notes: foundHabit.notes,
            notificationOn: foundHabit.notificationOn,
            notificationTime: foundHabit.notificationTime
        })

    }, [habits, route.params])

    const getTotalConsecutive = (consecutive: HabitProps['consecutive']) => {
        //need to get all the completed habits from consecutive
        let consecutiveTotal: CompletedHabitsProps[] = [];

        Object.keys(consecutive).forEach((goalKey, i) => {
            const { count } = consecutive[goalKey];
            if (count.length > 0) {
                consecutiveTotal = consecutiveTotal.concat(count)
            }
        })

        return consecutiveTotal;
    }

    const checkResetConsecutive = (prevConsec: HabitProps['consecutive'], newConsec: HabitProps['consecutive']) => {
        if (isEqual(prevConsec, newConsec)) return;

        const keys = Object.keys(newConsec);

        for (let i = 0; i < keys.length; i++) {
            const newGoal = newConsec[keys[i]];
            const oldGoal = prevConsec[keys[i]];

            if (newGoal.count.length != oldGoal.count.length) {
                if (newGoal.count.length == newGoal.goal) {
                    //accomplished star
                    setCongratsIndex(i)
                    return;
                }

                if (newGoal.count.length < newGoal.goal || i == keys.length - 1) {
                    if (newGoal.count.length < oldGoal.count.length) {
                        //go to previous goal count
                        const diff = oldGoal.count.length;

                        if (diff < 7) {
                            setResetBalls(1);
                        } else {
                            const amt = Math.ceil(diff / 6);
                            setResetBalls(amt ? amt : 1);
                            setBanner('warning', 'Missed two or more days. Resetting to the previous goal reached.')
                        }
                        return;
                    }
                    break;
                }
            }
        }

        //if count is over 60 then drop balls at 66
        const consecTotalLen = getTotalConsecutive(newConsec).length;
        if (consecTotalLen > 60) {
            const reminder = consecTotalLen % 6;
            if (reminder < 1) {
                setResetBalls(1);
            }
        }
    }

    const handleAddCompletedHabit = () => {
        if (!habit) {
            setBanner('error', "Sorry, couldn't found the habit id.");
            navigation.goBack()
        } else {
            addCompletedHabit(habit.docId)
        }
    }

    if (!habit || !habitEdit) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' />
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {congratsIndex != undefined && <CongratsStar goalIndex={congratsIndex} />}
                <HabitHeader
                    habit={habit}
                    edit={edit}
                    setHabitEdit={setHabitEdit}
                    habitEdit={habitEdit}
                />
                <Tracker
                    completedHabits={habit.completedHabits}
                    startDate={habit.createdAt}
                    endDate={habit.archivedAt}
                    activeDay={route.params.activeDay}
                    handleAddCompletedHabit={handleAddCompletedHabit}
                    consecutive={habit.consecutive}
                />
                <View style={styles.totalContainer}>
                    <AsapText>Total: </AsapText>
                    <AsapTextBold>{habit.completedHabits.length}</AsapTextBold>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        padding: normalizeWidth(15)
    },
    totalContainer: {
        flexDirection: 'row',
        marginTop: 5
    }
})

const mapStateToProps = (state: ReducerStateProps) => ({
    habits: state.habits.habits
})

export default connect(mapStateToProps, { setBanner, addCompletedHabit, updateHabit, archiveHabit })(HabitCom);