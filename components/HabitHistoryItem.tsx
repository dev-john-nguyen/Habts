import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native'
import { AsapText, LatoText } from './StyledText';
import Colors from '../constants/Colors';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { HabitProps } from '../services/habits/types';
import { formatTime } from '../utils/tools';
import { normalizeHeight } from '../utils/styles';

export default ({ habit }: { habit: HabitProps }) => {
    const {
        startTime,
        endTime,
        cue,
        locationDes,
        notes,
        remove,
        name,
        totalCount,
        consecutive
    } = habit

    return (
        <View style={styles.container}>
            <View style={styles.data}>
                <View style={styles.header}>
                    <View>
                        <AsapText style={styles.headerText}>{name}</AsapText>
                        <LatoText style={styles.headerSubText}>{remove}</LatoText>
                    </View>
                </View>
                <View style={styles.dataItem}>
                    <Entypo name="clock" size={normalizeHeight(30)} color={Colors.primary} />
                    <LatoText style={styles.dataText}>{formatTime(startTime)} - {formatTime(endTime)}</LatoText>
                </View>

                <View style={styles.dataItem}>
                    <Entypo name="bar-graph" size={normalizeHeight(30)} color={Colors.primary} />
                    <LatoText style={styles.dataText}>{consecutive.toString()} days in a row!</LatoText>
                </View>

                <View style={styles.dataItem}>
                    <Entypo name="link" size={normalizeHeight(30)} color={Colors.primary} />
                    <LatoText style={styles.dataText}>{cue}</LatoText>
                </View>

                <View style={styles.dataItem}>
                    <Entypo name="location-pin" size={normalizeHeight(30)} color={Colors.primary} />
                    <LatoText style={styles.dataText}>{locationDes}</LatoText>
                </View>

                <View style={styles.dataItem}>
                    <Entypo name="text-document" size={normalizeHeight(30)} color={Colors.primary} />
                    <ScrollView style={{ maxHeight: normalizeHeight(20) }}>
                        <LatoText style={styles.dataText}>{notes}</LatoText>
                    </ScrollView>
                </View>

                <View style={styles.dataItem}>
                    <MaterialCommunityIcons name="sigma" size={normalizeHeight(30)} color={Colors.primary} />
                    <LatoText style={styles.dataText}>{totalCount.toString()}</LatoText>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: .5,
        paddingLeft: 20,
        paddingRight: 20
    },
    header: {
        alignItems: 'center'
    },
    headerText: {
        fontSize: normalizeHeight(20),
        color: Colors.primary,
        alignSelf: 'center'
    },
    headerSubText: {
        fontSize: normalizeHeight(50),
        color: Colors.grey,
        textDecorationLine: 'line-through',
        alignSelf: 'flex-end'
    },
    data: {
        flex: 1
    },
    dataItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    dataText: {
        fontSize: normalizeHeight(50),
        color: Colors.black,
        marginLeft: 10
    }
})