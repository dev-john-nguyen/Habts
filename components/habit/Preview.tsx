import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { AsapText, LatoText } from '../StyledText';
import { HabitProps } from '../../services/habits/types';
import { DateTime } from 'luxon';
import { formatTime } from '../../utils/tools';
import { normalizeWidth } from '../../utils/styles';

interface HabitPreviewProps {
    onPress: () => void;
    habit: HabitProps;
    active: boolean;
}

export default ({ onPress, habit, active }: HabitPreviewProps) => {
    const styles = genStyles(active);
    const iconColor = active ? Colors.white : Colors.mediumGrey
    return (
        <Pressable style={styles.container} onPress={onPress}
        >
            <View style={styles.timeContainer}>
                <AsapText style={styles.timeStart}>{formatTime(habit.startTime)}</AsapText>
                <AsapText style={styles.timeEnd}>{formatTime(habit.endTime)}</AsapText>
            </View>
            <View style={styles.containerGap} />
            <View style={[styles.contentContainer, active ? Colors.boxShadow : undefined]}>
                <View style={styles.notification}>
                    {
                        habit.notificationOn
                            ? <Entypo name="bell" size={normalizeWidth(25)} color={iconColor} />
                            : <Entypo name="sound-mute" size={normalizeWidth(25)} color={iconColor} />
                    }
                </View>

                <AsapText style={styles.contentHeader}>{habit.name}</AsapText>

                <View style={styles.contentItem}>
                    <Entypo name="bar-graph" size={normalizeWidth(25)} color={iconColor} />
                    <LatoText style={styles.contentItemText}>{habit.consecutive.length} day(s) in a row</LatoText>
                </View>

                <View style={styles.contentItem}>
                    <Entypo name="link" size={normalizeWidth(25)} color={iconColor} />
                    <LatoText style={styles.contentItemText}>{habit.cue}</LatoText>
                </View>

                <View style={styles.contentItem}>
                    <Entypo name="location-pin" size={normalizeWidth(25)} color={iconColor} />
                    <LatoText style={styles.contentItemText}>{habit.locationDes}</LatoText>
                </View>

                <View style={styles.contentItem}>
                    <Entypo name="text-document" size={normalizeWidth(25)} color={iconColor} />
                    <LatoText style={styles.contentItemText} numberOfLines={3} ellipsizeMode='tail'>{habit.notes}</LatoText>
                </View>

            </View>
        </Pressable>
    )
}

const genStyles = (active: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 50
    },
    notification: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    count: {
        position: 'absolute',
        top: 10,
        left: 10
    },
    countText: {
        fontSize: normalizeWidth(30),
        color: active ? Colors.white : Colors.mediumGrey,
    },
    containerGap: {
        flex: .05
    },
    containerOuterGap: {
        flex: .2
    },
    timeContainer: {
        alignItems: 'flex-start'
    },
    timeStart: {
        color: active ? Colors.white : Colors.lightGrey,
        fontSize: normalizeWidth(20),
        marginBottom: 5
    },
    timeEnd: {
        color: active ? Colors.white : Colors.lightGrey,
        fontSize: normalizeWidth(20),
    },
    contentContainer: {
        flex: 1,
        backgroundColor: active ? Colors.primary : Colors.veryLightGrey,
        borderRadius: 20,
        paddingTop: 15,
        padding: 10,
    },
    contentHeader: {
        color: active ? Colors.white : Colors.mediumGrey,
        fontSize: normalizeWidth(20),
        alignSelf: 'center',
        marginBottom: 5,
        width: '80%',
        marginRight: 5,
        marginLeft: 10,
        textTransform: 'capitalize'
    },
    contentItem: {
        flexDirection: 'row',
        margin: 5,
        alignItems: 'center'
    },
    contentItemText: {
        fontSize: normalizeWidth(32),
        color: active ? Colors.white : Colors.mediumGrey,
        marginLeft: 10,
        flex: 1
    }
})