import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import Colors from '../constants/Colors';
import { Entypo } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import Layout from '../constants/Layout';
import { BottomTabParamList, RootStackParamList } from '../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import HabitHeader from '../components/HabitHeader';
import { RouteProp } from '@react-navigation/native';
import { connect } from 'react-redux';
import { ReducerStateProps } from '../services';
import { HabitProps, HabitsActionsProps, HabitEditProps, CompletedHabitsProps } from '../services/habits/types';
import { setBanner } from '../services/banner/actions';
import { BannerActionsProps } from '../services/banner/types';
import { addCompletedHabit, updateHabit, archiveHabit } from '../services/habits/actions';
import Modal from '../components/ArchiveModal';
import { normalizeHeight } from '../utils/styles';
import { LinearGradient } from 'expo-linear-gradient';
import DropBallJar from '../components/DropBallJar';
import ShootingStars from '../components/shootingstars';
import Congrats from '../components/congrats';
import Notes from '../components/habit/Notes';

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
    const [showNotes, setShowNotes] = useState(false);
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
        const foundHabit = habits.find((item) => item.docId === habitDocId)

        if (!foundHabit) {
            navigation.goBack();
            return;
        }

        setHabit(foundHabit);

        setTotalConsecutiveCompletedHabits(foundHabit);

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

    const setTotalConsecutiveCompletedHabits = (foundHabit: HabitProps) => {
        //need to get all the completed habits from consecutive
        let consecutiveTotal: CompletedHabitsProps[] = [];

        Object.keys(foundHabit.consecutive).forEach((goalKey, i) => {
            const { count } = foundHabit.consecutive[goalKey];
            if (count.length > 0) {
                consecutiveTotal = consecutiveTotal.concat(count)
            }
        })

        setConsecCompletedHabits(consecutiveTotal);
    }

    const handleAddCompletedHabit = () => {
        if (!habit) {
            setBanner('error', "Sorry, couldn't found the habit id.");
            navigation.goBack()
        } else {
            addCompletedHabit(habit.docId)
        }
    }

    const onNotesClose = () => setShowNotes(showNotes ? false : true);

    if (!habit || !habitEdit) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' />
            </View>
        )
    }

    const onUpdateNotes = (text: string) => setHabitEdit({ ...habitEdit, notes: text })


    return (
        <LinearGradient
            style={{ flex: 1 }}
            colors={[Colors.primary, 'rgba(17, 81, 115, 0.5)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <ShootingStars count={consecCompletedHabits.length} />
            <Congrats message={'Wow!'} />
            <ScrollView
                style={styles.container}
                disableScrollViewPanResponder={true}
                contentContainerStyle={{ paddingBottom: 30 }}
                scrollEnabled={scrollEnabled}
            >
                <HabitHeader
                    habit={habit}
                    edit={edit}
                    setHabitEdit={setHabitEdit}
                    habitEdit={habitEdit}
                    showNotes={showNotes}
                    setShowNotes={setShowNotes}
                />
                <View style={styles.habit}>
                    <DropBallJar
                        setScrollEnabled={setScrollEnabled}
                        completedHabits={consecCompletedHabits}
                        handleAddCompletedHabit={handleAddCompletedHabit}
                        activeDay={route.params.activeDay}
                    />
                </View>
            </ScrollView>
            {
                showNotes &&
                <Notes
                    notes={habit.notes}
                    onClose={onNotesClose}
                    edit={edit}
                    editNotes={habitEdit.notes}
                    updateNotes={onUpdateNotes}
                />
            }
        </LinearGradient>
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
        paddingTop: 10,
        marginTop: normalizeHeight(15)
    },
    bell: {
        position: 'absolute',
        top: '10%',
        right: -30,
        zIndex: 10
    },
    menu: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 20,
        backgroundColor: Colors.secondary,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    content: {
        height: (Layout.window.height / 3),
        paddingLeft: 20,
        paddingRight: 20,
    },
    header: {
        flex: .5,
        alignItems: 'center'
    },
    headerText: {
        fontSize: 50,
        color: Colors.primary,
        alignSelf: 'center'
    },
    headerSubText: {
        fontSize: 12,
        color: Colors.grey,
        textDecorationLine: 'line-through',
        alignSelf: 'flex-end'
    },
    data: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    dataItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dataText: {
        fontSize: 12,
        color: Colors.black,
        marginLeft: 10
    },
    habit: {
        flex: 1
    }

})

const mapStateToProps = (state: ReducerStateProps) => ({
    habits: state.habits.habits
})

export default connect(mapStateToProps, { setBanner, addCompletedHabit, updateHabit, archiveHabit })(HabitCom);