import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { normalizeWidth } from '../../utils/styles';
import { AsapText } from '../StyledText';
import { HabitProps } from '../../services/habits/types';

interface Props {
    consecutive: HabitProps['consecutive'];
    size: number;
    infoText?: string;
    name?: string;
    home?: boolean;
}

const HabitBadges = ({ consecutive, size, infoText, name, home }: Props) => {
    const goalKeys = Object.keys(consecutive);

    const mappedBadges = [];

    //should be order
    for (let i = 0; i < goalKeys.length; i++) {
        const { count, goal, total } = consecutive[goalKeys[i]];
        if (count.length >= goal) {
            const star = (i % 2) < 1 ? 'star-o' : 'star';
            const color = i < 2 ? Colors.white : Colors.yellow
            mappedBadges.push(
                <View style={styles.star} key={i}>
                    <FontAwesome name={star} size={size} color={color} />
                    <AsapText style={[styles.text, { color: color }]}>{name ? name : total}</AsapText>
                </View>
            )
        }
    }

    if (mappedBadges.length < 1 && infoText) {
        return (
            <View style={styles.stars}>
                <View style={styles.info} key={mappedBadges.length + 1}>
                    <Entypo name="info-with-circle" size={normalizeWidth(30)} color={Colors.white} />
                    <AsapText style={styles.emptyText}> {infoText}</AsapText>
                </View>
            </View>
        )
    }

    if (home) {
        //display the last badge completed
        return (
            <View style={styles.stars}>
                {mappedBadges[mappedBadges.length - 1]}
            </View>
        )
    }

    return (
        <View style={styles.stars}>
            {mappedBadges}
        </View>
    )
}

const styles = StyleSheet.create({
    stars: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center'
    },
    emptyText: {
        fontSize: normalizeWidth(35),
        color: Colors.white
    },
    star: {
        marginLeft: 5,
        alignItems: 'center'
    },
    text: {
        fontSize: normalizeWidth(40)
    },
    info: {
        width: '50%',
        flexDirection: 'row',
        alignSelf: 'center'
    }
})

export default HabitBadges;