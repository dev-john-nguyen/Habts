import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { AsapText, LatoText, AsapTextBold } from '../StyledText';
import { HabitProps, CompletedHabitsProps } from '../../services/habits/types';
import { DateTime } from 'luxon';
import { formatTime } from '../../utils/tools';
import { normalizeWidth } from '../../utils/styles';
import CircleChecked from '../../assets/svgs/CircleCheck';
import CircleSquare from '../../assets/svgs/CircleSquare';

interface HabitPreviewProps {
    onPress: () => void;
    habit: HabitProps;
    active: boolean;
}

export default ({ onPress, habit, active }: HabitPreviewProps) => {
    const styles = genStyles(active);
    const iconColor = active ? Colors.white : Colors.grey;

    let consecutiveTotal: CompletedHabitsProps[] = [];

    Object.keys(habit.consecutive).forEach((goalKey, i) => {
        const { count } = habit.consecutive[goalKey];
        if (count.length > 0) {
            consecutiveTotal = consecutiveTotal.concat(count)
        }
    })

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

                <Pressable style={styles.circleInfo}>
                    {active ? <CircleChecked color={Colors.green} /> : <CircleSquare squareColor={Colors.white} circleColor={Colors.primary} />}
                </Pressable>

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