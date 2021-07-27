import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { StyledText, StyledTextBold } from '../StyledText';
import { HabitProps, HabitsActionsProps } from '../../services/habits/types';
import { formatTime, calcDaysInARow } from '../../utils/tools';
import { normalizeWidth } from '../../utils/styles';
import CircleChecked from '../../assets/svgs/CircleCheck';
import CircleSquare from '../../assets/svgs/CircleSquare';
import { consecutiveTools } from '../../services/habits/utils/consecutive';
import PreviewActionItem from './components/PreviewActionItem';
import { isEqual, cloneDeep } from 'lodash';
import { BannerActionsProps } from '../../services/banner/types';

interface HabitPreviewProps {
    onPress: () => void;
    habit: HabitProps;
    active: boolean;
    addCompletedHabit: HabitsActionsProps['addCompletedHabit'];
    activeDate: Date;
    setCongratsBanner: BannerActionsProps['setCongratsBanner'];
    setBanner: BannerActionsProps['setBanner'];
}

type ActionValsProps = {
    warning: boolean,
    reset: boolean,
    isYesterday: boolean,
    targetDate: Date | undefined,
    isToday: boolean,
}

export default ({ onPress, habit, active, addCompletedHabit, activeDate, setCongratsBanner, setBanner }: HabitPreviewProps) => {
    const [loading, setLoading] = useState(false);
    const [styles] = useState(genStyles(active));
    const [shownWarning, setShownWarning] = useState(false);
    const [actionVals, setActionVals] = useState<ActionValsProps>({
        warning: false,
        reset: false,
        isYesterday: false,
        targetDate: undefined,
        isToday: false
    });
    const [iconColor] = useState(active ? Colors.white : Colors.grey);
    const prevConsec = useRef<HabitProps['consecutive']>();

    const handleShowBadgeBanner = (newConsec: HabitProps['consecutive']) => {
        if (isEqual(prevConsec.current, newConsec) || !prevConsec.current) return;
        const keys = Object.keys(newConsec);

        for (let i = 0; i < keys.length; i++) {
            const newGoal = newConsec[keys[i]];
            const oldGoal = prevConsec.current[keys[i]];

            if (newGoal.count.length != oldGoal.count.length) {
                if (newGoal.count.length == newGoal.goal) {
                    //accomplished star
                    // setCongratsIndex(i)
                    setCongratsBanner(i, habit.name)
                    return;
                }
            }
        }
    }

    useEffect(() => {
        handleShowBadgeBanner(habit.consecutive)
        prevConsec.current = cloneDeep(habit.consecutive);
    }, [habit.consecutive])


    useEffect(() => {
        let today = new Date()
        const { warning, reset } = consecutiveTools.shouldReset(habit, today);
        const { yesterday, date, isToday } = handleTargetDate();

        setActionVals({
            isYesterday: yesterday,
            targetDate: date,
            warning: warning ? true : false,
            reset: reset ? true : false,
            isToday
        });

    }, [habit.completedHabits, activeDate])

    const onCompletedActionPress = async () => {
        if (loading) return;

        //even if yesterday was a miss still show warning
        if (!shownWarning && (actionVals.warning || actionVals.reset) && !actionVals.isYesterday) {
            setShownWarning(true);
            setBanner('warning', "Please mark yesterday as completed if performed. If not, continue by trying again.");
            return;
        }

        setLoading(true);

        await addCompletedHabit(habit.docId, actionVals.isYesterday)

        setLoading(false)
    }

    const handleTargetDate = () => {
        let todayDate = new Date();
        let yesterday = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);

        const isSameDay = consecutiveTools.datesAreOnSameDay(todayDate, activeDate);
        const isYest = consecutiveTools.datesAreOnSameDay(yesterday, activeDate);

        if (!isSameDay && !isYest) return {
            yesterday: false,
            date: undefined,
            isToday: isSameDay
        }

        return {
            yesterday: isYest,
            date: yesterday,
            isToday: isSameDay
        }
    }

    const renderActionIcons = () => {

        //check if choosen date (activeDate) isn't on the same day as today or yesterday
        if (!actionVals.targetDate) {
            return (
                <View style={styles.circleInfo}>
                    <CircleSquare squareColor={Colors.mediumGrey} circleColor={Colors.grey} />
                </View>
            )
        }

        let foundCompleted = habit.completedHabits.find(({ dateCompleted }) => {
            if (consecutiveTools.datesAreOnSameDay(dateCompleted, activeDate)) return true
        })

        if (foundCompleted) {
            return (
                <View style={styles.circleInfo}>
                    <CircleChecked color={Colors.green} />
                </View>
            )
        } else {

            //if active date is yesterday and today has already been completed show unavailable
            let isTodayCompleted = habit.completedHabits.find(({ dateCompleted }) => {
                if (consecutiveTools.datesAreOnSameDay(dateCompleted, new Date())) return true
            })

            if (actionVals.isYesterday && isTodayCompleted) {
                return (
                    <View style={styles.circleInfo}>
                        <CircleSquare squareColor={Colors.mediumGrey} circleColor={Colors.grey} />
                    </View>
                )
            }


            if (actionVals.reset || actionVals.warning) {
                return (
                    <View style={styles.circleInfo}>
                        <PreviewActionItem handleAddCompletedHabit={onCompletedActionPress} isWarning={true} />
                    </View>
                )
            }

            return (
                <View style={styles.circleInfo}>
                    <PreviewActionItem handleAddCompletedHabit={onCompletedActionPress} />
                </View>
            )
        }
    }

    return (
        <Pressable style={styles.container} onPress={onPress}
        >
            <View style={styles.timeContainer}>
                <StyledTextBold style={styles.timeStart} numberOfLines={1} ellipsizeMode='head'>{formatTime(habit.startTime)}</StyledTextBold>
                <StyledTextBold style={styles.timeEnd} numberOfLines={1}>{formatTime(habit.endTime)}</StyledTextBold>
            </View>
            <View style={styles.containerGap}>
                <View style={styles.gapLine} />
            </View>
            <View style={styles.contentContainer}>

                {renderActionIcons()}

                <View style={styles.notification}>
                    {
                        habit.notificationOn
                            ? <FontAwesome name="bell" size={normalizeWidth(25)} color={iconColor} />
                            : <FontAwesome name="bell-slash" size={normalizeWidth(25)} color={iconColor} />
                    }
                </View>

                <StyledTextBold style={styles.contentHeader}>{habit.name}</StyledTextBold>
                <View style={styles.borderLineBottom} />
                <View style={styles.contentItem}>
                    <StyledText style={styles.contentItemText}>{habit.cue}</StyledText>
                </View>

                <View style={styles.contentItem}>
                    <StyledText style={styles.contentItemText}>{habit.locationDes}</StyledText>
                </View>

                <View style={{ marginTop: 5 }}>
                    <View style={styles.contentItem}>
                        <Entypo name="bar-graph" size={normalizeWidth(30)} color={iconColor} style={{ marginRight: 5 }} />
                        <StyledText style={styles.contentItemText}>{calcDaysInARow(habit.completedHabits)} day(s) in a row</StyledText>
                    </View>

                    <View style={styles.contentItem}>
                        <Entypo name="text-document" size={normalizeWidth(30)} color={iconColor} style={{ marginRight: 5 }} />
                        <StyledText style={styles.contentItemText} numberOfLines={2} ellipsizeMode='tail'>{habit.notes}</StyledText>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

const genStyles = (active: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 20
    },
    circleInfo: {
        position: 'absolute',
        zIndex: 100,
        height: normalizeWidth(8),
        width: normalizeWidth(8),
        left: -normalizeWidth(20),
        top: -normalizeWidth(20)
    },
    borderLineBottom: {
        backgroundColor: active ? Colors.secondary : '#E8E8E8',
        height: 1,
        width: '100%',
        marginBottom: 5
    },
    notification: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    countText: {
        fontSize: normalizeWidth(30),
        color: active ? Colors.white : Colors.grey,
    },
    containerGap: {
        alignItems: 'flex-start',
        width: '7%'
    },
    gapLine: {
        width: 1,
        height: '120%',
        backgroundColor: Colors.veryLightGrey
    },
    timeContainer: {
        alignItems: 'flex-start',
        width: '20%'
    },
    timeStart: {
        color: active ? Colors.primary : Colors.grey,
        fontSize: normalizeWidth(18),
        marginBottom: 1,
    },
    timeEnd: {
        color: active ? Colors.primary : Colors.grey,
        fontSize: normalizeWidth(18)
    },
    contentContainer: {
        flex: 1,
        backgroundColor: active ? Colors.primary : Colors.mediumGrey,
        borderRadius: 20,
        padding: 20,
    },
    contentHeader: {
        color: active ? Colors.white : Colors.grey,
        fontSize: normalizeWidth(18),
        textTransform: 'capitalize'
    },
    contentItem: {
        flexDirection: 'row',
        marginBottom: 2,
        alignItems: 'center',
    },
    contentItemText: {
        fontSize: normalizeWidth(40),
        color: active ? Colors.white : Colors.grey,
        flexWrap: 'wrap',
        flex: 1
    }
})