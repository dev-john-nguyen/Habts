import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, AppState, AppStateStatus, Pressable } from 'react-native';
import { AsapText, LatoText, AsapTextBold } from '../components/StyledText'
import Colors from '../constants/Colors';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import HabitPreview from '../components/habit/Preview';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import BottomTab from '../navigation/BottomTab';
import { connect } from 'react-redux';
import { ReducerStateProps } from '../services';
import { HabitsProps, HabitProps, SequenceType } from '../services/habits/types';
import { getDateDiffInDays, calcMonthsInAdvance, convertTimeToInt, getDayName, getMonthShort, getDate } from '../utils/tools';
import { UserProps } from '../services/user/types';
import { DateTime } from 'luxon';
import Calendar from '../components/Calendar';
import * as Notifications from 'expo-notifications';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import Moon from '../components/Moon';
import Superman from '../assets/svgs/superman';
import Layout from '../constants/Layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pay from './settings/Pay';
import HomeBadges from '../components/badges/HomeBadges';

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, 'Home'>

interface HomeProps {
    navigation: HomeScreenNavProp;
    habits: HabitsProps['habits'];
    user: UserProps;
    archivedHabits: HabitsProps['habits'];
}


//note: to scroll to current position I can see how many habit preview items there are to determine where to scroll to

const Home = ({ navigation, habits, user, archivedHabits }: HomeProps) => {
    const appState = useRef(AppState.currentState);
    const [activeTime, setActiveTime] = useState(0);
    const [todayHabits, setTodayHabits] = useState<HabitsProps['habits']>([])
    const [activeDate, setActiveDate] = useState<Date>(new Date())
    const listRef: any = useRef();
    const [expired, setExpired] = useState(false)


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
                setTodayHabits(filterTodayHabits)
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
                    activeDay: new Date().getDate()
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
            const formattedactiveDate = convertTimeToInt({ date: activeDate, hour: activeDate.getHours(), minute: activeDate.getMinutes() })

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

    const navToHabit = (item: HabitProps) => !expired && navigation.navigate('Habit', { habitDocId: item.docId, activeDay: activeDate.getDate() });

    const navToReview = () => !expired && navigation.navigate('Review');

    const navToNew = () => !expired && navigation.navigate('New');

    const navToReviewHistory = () => !expired && navigation.navigate('ReviewHistory');

    const navToHabitHistory = () => !expired && navigation.navigate('HabitHistory');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.superman}>
                <Superman />
            </View>
            <View style={styles.headerContainer}>
                <View style={styles.headerLeftContainer}>
                    <View style={styles.dayContainer}>
                        <Calendar
                            setActiveDate={setActiveDate}
                            activeDate={activeDate}
                        />
                        {getDate(new Date()) !== getDate(activeDate) && <Entypo name="back-in-time" size={normalizeWidth(20)} color="white" style={styles.refreshTime} onPress={() => setActiveDate(new Date())} />}
                    </View>
                    <View>
                        <AsapText style={styles.headerSubText}>{getDayName(activeDate)}</AsapText>
                        <AsapText style={styles.headerSubText}>{getMonthShort(activeDate)} {activeDate.getFullYear()}</AsapText>
                    </View>
                </View>
                <View style={styles.headerRightContainer}>
                    <HomeBadges habits={[...habits, ...archivedHabits]} navigation={navigation} />
                </View>
            </View>
            <View style={styles.notificationContainer}>
                <View style={styles.notificationContent}>
                    <FontAwesome name="file-text" size={normalizeWidth(20)} color={Colors.white} onPress={navToReview} />
                    <LatoText style={styles.reviewText}>{getDateDiffInDays(calcMonthsInAdvance(DateTime.fromJSDate(user.createdAt), 1), DateTime.now())} until next review</LatoText>
                </View>
            </View>
            <View style={styles.listTitleContainer}>
                <AsapTextBold style={styles.listTitleTimeText}>Time</AsapTextBold>
                <AsapTextBold style={styles.listTitleHabitText}>Habit</AsapTextBold>
            </View>
            <FlatList
                data={todayHabits}
                extraData={activeDate}
                ref={ref => listRef.current = ref}
                ListHeaderComponentStyle={styles.listHeader}
                ListEmptyComponent={() => (
                    <Pressable style={styles.empty} onPress={navToNew}>
                        <Entypo
                            name="add-to-list"
                            size={normalizeHeight(25)}
                            color={Colors.white}
                            onPress={navToNew}
                        />
                    </Pressable>
                )}
                renderItem={({ item, index }) => (
                    <HabitPreview
                        onPress={() => navToHabit(item)}
                        habit={item}
                        active={index === activeTime}
                    />
                )}
                keyExtractor={(item, index) => item.docId ? item.docId + index.toString() : index.toString()}
            />

            <BottomTab
                navtoNew={navToNew}
                navToHabitHistory={navToHabitHistory}
                navToReviewHistory={navToReviewHistory}
                navToSettings={navToSettings}
            />
            {expired && <Pay />}
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
    superman: {
        position: 'absolute',
        top: Layout.window.height / 2,
        right: 10,
        height: Layout.window.width / 4,
        width: Layout.window.width / 4,
        transform: [{ rotate: '-45deg' }]
    },
    dayContainer: {
        marginRight: 5
    },
    listTitleContainer: {
        width: '100%',
        marginBottom: 10,
        flexDirection: 'row',
        zIndex: -1
    },
    listTitleTimeText: {
        flex: .2,
        color: Colors.white,
        fontSize: normalizeWidth(25)
    },
    listTitleHabitText: {
        flex: 1,
        color: Colors.white,
        textAlign: 'center',
        fontSize: normalizeWidth(25)
    },
    refreshTime: {
        position: 'absolute',
        top: 2,
        right: 2,
        zIndex: 10
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
        position: 'absolute',
        top: -200,
        width: '100%',
        height: 150
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    headerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
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
    headerSubText: {
        fontSize: normalizeWidth(25),
        color: Colors.white
    },
    notificationContainer: {
        marginBottom: normalizeHeight(50),
        padding: 10,
        marginLeft: 20,
        justifyContent: 'flex-start',
        zIndex: -1
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

export default connect(mapStateToProps, {})(Home);

