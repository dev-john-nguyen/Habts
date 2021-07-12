import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, AppState, AppStateStatus } from 'react-native';
import { StyledText, StyledTextBold } from '../components/StyledText'
import Colors from '../constants/Colors';
import { Entypo } from '@expo/vector-icons';
import HabitPreview from '../components/habit/Preview';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import BottomTab from '../navigation/BottomTab';
import { connect } from 'react-redux';
import { ReducerStateProps } from '../services';
import { HabitsProps, HabitProps, SequenceType, HabitsActionsProps } from '../services/habits/types';
import { convertTimeToInt, getDayName, getMonthShort, getDate } from '../utils/tools';
import { UserProps, UserActionsProps } from '../services/user/types';
import { DateTime } from 'luxon';
import Calendar from '../components/Calendar';
import * as Notifications from 'expo-notifications';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pay from './settings/Pay';
import HomeBadges from '../components/badges/HomeBadges';
import { subscriptionPurchased } from '../services/user/actions';
import { addCompletedHabit } from '../services/habits/actions';
import Oval from '../assets/svgs/home/Oval';
import CongratsBanner from '../components/CongratsBanner';
import { cloneDeep } from 'lodash';
import HomeEmptyList from '../components/HomeEmptyList';

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, 'Home'>

interface HomeProps {
    navigation: HomeScreenNavProp;
    habits: HabitsProps['habits'];
    user: UserProps;
    archivedHabits: HabitsProps['habits'];
    subscriptionPurchased: UserActionsProps['subscriptionPurchased'];
    addCompletedHabit: HabitsActionsProps['addCompletedHabit'];
}


//note: to scroll to current position I can see how many habit preview items there are to determine where to scroll to

const Home = ({ navigation, habits, user, archivedHabits, subscriptionPurchased, addCompletedHabit }: HomeProps) => {
    const appState = useRef(AppState.currentState);
    const [activeTime, setActiveTime] = useState(0);
    const [todayHabits, setTodayHabits] = useState<HabitsProps['habits']>([]);
    const [activeDate, setActiveDate] = useState<Date>(new Date());
    const listRef: any = useRef();
    const [expired, setExpired] = useState(false);
    const [congratsData, setCongratsData] = useState<{ headerText: string, goalIndex: undefined | number }>({
        headerText: '',
        goalIndex: undefined
    })


    useEffect(() => {
        if (habits.length > 0) {
            const dayOfWeek = activeDate.getDay();
            const dayOfMonth = activeDate.getDate();

            const filterTodayHabits = habits.filter((habit) => {
                if (habit.sequence.type == SequenceType.weekly) {
                    const habitWeekDays = habit.sequence.value;
                    for (let i = 0; i < habitWeekDays.length; i++) {
                        if (habitWeekDays[i] === dayOfWeek) {
                            return true;
                        }
                    }

                    return false;
                }

                if (habit.sequence.type == SequenceType.monthly && !habit.sequence.value.find(day => day == dayOfMonth)) {
                    return false;
                }
                return true
            })

            handleActiveHabit(filterTodayHabits)

            if (filterTodayHabits) {
                setTodayHabits(cloneDeep(filterTodayHabits))
            } else {
                setTodayHabits([])
            }
        } else {
            setTodayHabits([])
        }
    }, [habits, activeDate])

    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data as { review: boolean, habitId: string };
            if (data.review) {
                navigation.navigate('Review')
            } else if (data.habitId) {
                navigation.navigate('Habit', {
                    habitDocId: data.habitId,
                    activeDay: new Date().toString()
                })
            }
        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        AppState.addEventListener("change", handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", handleAppStateChange);
        };
    }, []);

    useEffect(() => {
        //expiredAt is in utc
        if (user.expiredAt) {
            const utcNow = DateTime.utc();
            const luxExpiredAt = DateTime.fromJSDate(user.expiredAt).toUTC();
            if (utcNow > luxExpiredAt) {
                setExpired(true)
                return;
            }
        }
        setExpired(false)
    }, [user.expiredAt])

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (appState.current.match(/background/) &&
            nextAppState === "active") {
            setActiveDate(new Date())
        }
        appState.current = nextAppState;
    }

    const handleActiveHabit = (filterTodayHabits: HabitProps[]) => {
        if (filterTodayHabits.length < 1) return;

        if (getDate(new Date()) == getDate(activeDate)) {
            const formattedactiveDate = convertTimeToInt({ date: activeDate, hour: activeDate.getHours(), minute: activeDate.getMinutes(), zoneName: '' })

            let index = filterTodayHabits.findIndex((item) => convertTimeToInt(item.endTime) > formattedactiveDate)

            if (index < 0) {
                setActiveTime(-1);
                return;
            }

            setActiveTime(index);

            new Promise(resolve => setTimeout(resolve, 500))
                .then(() => {
                    listRef && listRef.current && listRef.current.scrollToIndex({
                        index: index,
                        animated: true,
                        viewPosition: 0.5
                    })
                })
        } else {
            setActiveTime(-1)
        }
    }

    const navToSettings = () => navigation.navigate('Settings');

    const navToHabit = (item: HabitProps) => !expired && navigation.navigate('Habit', { habitDocId: item.docId, activeDay: activeDate.toString() });

    const navToNew = () => !expired && navigation.navigate('New');

    const navToHabitHistory = () => !expired && navigation.navigate('HabitHistory');

    const onRefresh = () => {
        setActiveDate(new Date())
    }

    const isTodaysDate = (): Boolean => {
        const todaysDate = new Date();
        return activeDate.getDate() === todaysDate.getDate() && activeDate.getMonth() === todaysDate.getMonth() && activeDate.getFullYear() === todaysDate.getFullYear()
    }


    if (expired) return (
        <SafeAreaView style={{ flex: 1 }}>
            <Pay
                subscriptionPurchased={subscriptionPurchased}
            />
            <BottomTab
                navtoNew={navToNew}
                navToHabitHistory={navToHabitHistory}
                navToSettings={navToSettings}
                expired={expired}
            />
        </SafeAreaView>
    )

    return (
        <SafeAreaView style={styles.container}>
            <CongratsBanner headerText={congratsData.headerText} goalIndex={congratsData.goalIndex} />
            <View style={styles.headerContainer}>
                <View style={styles.headerLeftContainer}>
                    <View style={styles.dateContainer}>
                        <StyledTextBold style={styles.dayText}>{activeDate.getDate()}</StyledTextBold>
                        <View>
                            <StyledText style={styles.dateText}>{getDayName(activeDate)}</StyledText>
                            <StyledText style={[styles.dateText, { marginTop: 5 }]}>{getMonthShort(activeDate)} {activeDate.getFullYear()}</StyledText>
                        </View>
                    </View>
                    <View style={styles.ovalContainer}>
                        <Oval fillColor={Colors.secondary} />
                    </View>
                    {!isTodaysDate() && <Entypo name="back-in-time" size={normalizeHeight(30)} color={Colors.primary} style={styles.refreshTime} onPress={onRefresh} />}
                </View>
                <View style={styles.headerRightContainer}>
                    <HomeBadges habits={[...habits, ...archivedHabits]} navigation={navigation} />
                </View>
            </View>


            <View style={styles.content}>

                <View style={styles.contentBg} />

                <Calendar setActiveDate={setActiveDate} activeDate={activeDate} />

                <View style={styles.borderLineBottom} />

                <FlatList
                    style={{ height: '100%' }}
                    data={todayHabits}
                    extraData={[todayHabits, activeDate]}
                    contentContainerStyle={styles.contentContainerStyle}
                    ref={ref => listRef.current = ref}
                    ListHeaderComponent={() => (
                        <View style={styles.listTitleContainer}>
                            <StyledText style={styles.listHeaderText}>Time</StyledText>
                            <View style={{ flex: .1 }} />
                            <StyledText style={styles.listHeaderText}>Habit</StyledText>
                        </View>
                    )}
                    ListHeaderComponentStyle={styles.listHeader}
                    ListEmptyComponent={<HomeEmptyList navToNew={navToNew} />}
                    renderItem={({ item, index }) => (
                        <HabitPreview
                            onPress={() => navToHabit(item)}
                            habit={item}
                            active={index === activeTime}
                            addCompletedHabit={addCompletedHabit}
                            activeDate={activeDate}
                            setCongratsData={setCongratsData}
                        />
                    )}
                    keyExtractor={(item, index) => item.docId ? item.docId + index.toString() : index.toString()}
                />
            </View>

            <BottomTab
                navtoNew={navToNew}
                navToHabitHistory={navToHabitHistory}
                navToSettings={navToSettings}
                expired={expired}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 50,
    },
    ovalContainer: {
        width: '90%',
        height: normalizeHeight(50)
    },
    contentContainerStyle: {
        paddingBottom: normalizeHeight(20)
    },
    borderLineBottom: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.mediumGrey,
    },
    content: {
        backgroundColor: Colors.contentBg,
        marginTop: normalizeHeight(30),
        paddingTop: normalizeHeight(50),
        borderTopRightRadius: 60,
        borderTopLeftRadius: 60,
        flex: 1,
    },
    contentBg: {
        backgroundColor: Colors.contentBg,
        width: normalizeWidth(.9),
        alignSelf: 'center',
        height: normalizeHeight(1),
        borderTopRightRadius: 100,
        borderTopLeftRadius: 100,
        zIndex: -100,
        position: 'absolute'
    },
    superman: {
        position: 'absolute',
        top: normalizeHeight(2),
        right: 10,
        height: normalizeHeight(10),
        width: normalizeHeight(10),
        transform: [{ rotate: '-45deg' }],
        zIndex: 10
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: normalizeWidth(2.5),
    },
    refreshTime: {
        position: 'absolute',
        top: 0,
        right: '1%',
        zIndex: 1000
    },
    dayText: {
        fontSize: normalizeWidth(7),
        color: Colors.primary,
        marginRight: 5
    },
    dateText: {
        fontSize: normalizeWidth(25),
        color: Colors.grey
    },
    listTitleContainer: {
        width: '100%',
        marginTop: 20,
        marginBottom: 30,
        flexDirection: 'row',
        zIndex: -1
    },
    listHeaderText: {
        flex: .2,
        color: Colors.grey,
        fontSize: normalizeWidth(30)
    },
    empty: {
        alignSelf: 'stretch',
        backgroundColor: Colors.primary,
        borderRadius: 20,
        padding: 20,
        margin: 20,
        alignItems: 'center'
    },
    listHeader: {
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerLeftContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: .7
    },
    headerRightContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    headerText: {
        fontSize: normalizeWidth(7),
        color: Colors.white,
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    reviewText: {
        fontSize: normalizeWidth(30),
        marginLeft: 10,
        color: Colors.white
    },
    contentContainer: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10
    },
    contentGap: {
        flex: .1
    },
})

const mapStateToProps = (state: ReducerStateProps) => ({
    habits: state.habits.habits,
    archivedHabits: state.habits.archivedHabits,
    user: state.user
})

export default connect(mapStateToProps, { subscriptionPurchased, addCompletedHabit })(Home);

