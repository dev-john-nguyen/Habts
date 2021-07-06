import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { AsapText, LatoText, AsapTextBold } from '../StyledText';
import { HabitProps, CompletedHabitsProps, HabitsActionsProps } from '../../services/habits/types';
import { DateTime, Interval } from 'luxon';
import { formatTime } from '../../utils/tools';
import { normalizeWidth } from '../../utils/styles';
import CircleChecked from '../../assets/svgs/CircleCheck';
import CircleSquare from '../../assets/svgs/CircleSquare';
import { consecutiveTools } from '../../services/habits/utils/consecutive';
import AlertCircle from '../../assets/svgs/AlertCircle';

interface HabitPreviewProps {
    onPress: () => void;
    habit: HabitProps;
    active: boolean;
    addCompletedHabit: HabitsActionsProps['addCompletedHabit'];
    activeDate: Date;
}

export default ({ onPress, habit, active, addCompletedHabit, activeDate }: HabitPreviewProps) => {
    const [loading, setLoading] = useState(false);
    // const [pressed, setPressed] = useState(false);
    // const [pressedColor, setPressedColor] = useState(Colors.orange)
    const styles = genStyles(active);
    const iconColor = active ? Colors.white : Colors.grey;

    let consecutiveTotal: CompletedHabitsProps[] = [];

    Object.keys(habit.consecutive).forEach((goalKey, i) => {
        const { count } = habit.consecutive[goalKey];
        if (count.length > 0) {
            consecutiveTotal = consecutiveTotal.concat(count)
        }
    })


    // useEffect(() => {
    //     let interval: any;
    //     if (pressed) {
    //         let opacity = 1;
    //         let count = 0;
    //         interval = setInterval(async () => {
    //             setPressedColor(`rgba(${Colors.orangeRgb}, ${opacity})`);
    //             opacity = opacity - .05;
    //             if (count > 10) {
    //                 clearInterval(interval);
    //                 // await handleCompletePress();
    //                 setPressedColor(Colors.orange)
    //             } else {
    //                 count++
    //             }
    //         }, 100)
    //     } else {
    //         clearInterval(interval)
    //         setPressedColor(Colors.orange)
    //     }

    //     return () => {
    //         clearInterval(interval)
    //     }
    // }, [pressed])

    const handleCompletePress = async () => {
        if (loading) return;

        setLoading(true);

        await addCompletedHabit(habit.docId)

        setLoading(false)
    }


    const renderActionIcons = () => {
        let todayDate = new Date();

        if (!consecutiveTools.datesAreOnSameDay(todayDate, activeDate)) {
            return (
                <View style={styles.circleInfo}>
                    <CircleSquare squareColor={Colors.mediumGrey} circleColor={Colors.grey} />
                </View>
            )
        }

        let foundCompleted = habit.completedHabits.find(({ dateCompleted }) => {
            if (consecutiveTools.datesAreOnSameDay(dateCompleted, todayDate)) return true
        })

        if (foundCompleted) {
            return (
                <View style={styles.circleInfo}>
                    <CircleChecked color={Colors.green} />
                </View>
            )
        } else {
            let prevDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);

            let foundPrevDay = habit.completedHabits.find(({ dateCompleted }) => {
                if (consecutiveTools.datesAreOnSameDay(dateCompleted, prevDate)) return true
            });

            if (!foundPrevDay) {
                return (
                    <Pressable style={styles.circleInfo} onLongPress={handleCompletePress}>
                        {({ pressed }) => <AlertCircle fillColor={pressed ? `rgba(${Colors.orangeRgb}, .5)` : Colors.orange} strokeColor={Colors.white} />}
                    </Pressable>
                )
            }

            return (
                <Pressable style={styles.circleInfo} onLongPress={handleCompletePress}>
                    {({ pressed }) => <CircleSquare squareColor={Colors.white} circleColor={pressed ? `rgba(${Colors.primaryRgb}, .5)` : Colors.primary} />}
                </Pressable>
            )
        }
    }

    return (
        <Pressable style={styles.container} onPress={onPress}
        >
            <View style={styles.timeContainer}>
                <AsapTextBold style={styles.timeStart}>{formatTime(habit.startTime)}</AsapTextBold>
                <AsapTextBold style={styles.timeEnd}>{formatTime(habit.endTime)}</AsapTextBold>
            </View>
            <View style={styles.containerGap}>
                <View style={styles.gapLine} />
            </View>
            <View style={styles.contentContainer}>

                {renderActionIcons()}

                <View style={styles.notification}>
                    {
                        habit.notificationOn
                            ? <Entypo name="bell" size={normalizeWidth(25)} color={iconColor} />
                            : <Entypo name="sound-mute" size={normalizeWidth(25)} color={iconColor} />
                    }
                </View>

                <AsapTextBold style={styles.contentHeader}>{habit.name}</AsapTextBold>
                <View style={styles.borderLineBottom} />
                <View style={styles.contentItem}>
                    <LatoText style={styles.contentItemText}>{habit.cue}</LatoText>
                </View>

                <View style={styles.contentItem}>
                    <LatoText style={styles.contentItemText}>{habit.locationDes}</LatoText>
                </View>

                <View style={{ marginTop: 5 }}>
                    <View style={styles.contentItem}>
                        <Entypo name="bar-graph" size={normalizeWidth(30)} color={iconColor} style={{ marginRight: 5 }} />
                        <LatoText style={styles.contentItemText}>{consecutiveTotal.length} day(s) in a row</LatoText>
                    </View>

                    <View style={styles.contentItem}>
                        <Entypo name="text-document" size={normalizeWidth(30)} color={iconColor} style={{ marginRight: 5 }} />
                        <LatoText style={styles.contentItemText} numberOfLines={3} ellipsizeMode='tail'>{habit.notes}</LatoText>
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
        flex: .2,
        alignItems: 'center'
    },
    gapLine: {
        width: 1,
        height: '120%',
        backgroundColor: Colors.mediumGrey
    },
    timeContainer: {
        alignItems: 'flex-start'
    },
    timeStart: {
        color: active ? Colors.primary : Colors.grey,
        fontSize: normalizeWidth(18),
        marginBottom: 1
    },
    timeEnd: {
        color: active ? Colors.primary : Colors.grey,
        fontSize: normalizeWidth(18),
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