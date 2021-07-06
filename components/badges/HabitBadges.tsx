import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { normalizeWidth, normalizeHeight } from '../../utils/styles';
import { AsapText, AsapTextBold } from '../StyledText';
import { HabitProps } from '../../services/habits/types';
import Badge from "../../assets/svgs/badge";

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
    let fourStars = true;

    //should be order
    for (let i = 0; i < goalKeys.length - 1; i++) {
        const { count, goal, total } = consecutive[goalKeys[i]];
        if (count.length >= goal) {
            const outlineBadge = (i % 2) < 1 ? true : false;
            const color = i < 2 ? Colors.primary : Colors.yellow
            mappedBadges.push(
                <View style={styles.star} key={i}>
                    {!name && <AsapText style={[styles.text, { color: color }]} numberOfLines={1}>{total}</AsapText>}
                    <Badge fill={color} style={styles.badge} outlineBadge={outlineBadge} />
                </View>
            )
        } else {
            fourStars = false;
            mappedBadges.push(
                <View style={styles.nextGoalContainer} key={i}>
                    <MaterialCommunityIcons name="target" size={normalizeHeight(60)} color={Colors.primary} />
                    <AsapTextBold style={styles.nextGoal} numberOfLines={1}>{count.length}<AsapText style={styles.nextGoal}>/{goal}</AsapText></AsapTextBold>
                </View>
            )
            break;
        }
    }

    if (home) {
        //display the last badge completed
        return (
            <View style={styles.content}>
                {mappedBadges[mappedBadges.length - (fourStars ? 1 : 2)]}
            </View>
        )
    }

    return (
        <View style={[styles.container, Colors.boxShadowLight]}>
            <View style={styles.content}>
                {mappedBadges.length > 0 ? mappedBadges : <AsapTextBold>Badges</AsapTextBold>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        backgroundColor: Colors.white,
        borderRadius: 10,
        width: '60%',
        margin: 20
    },
    content: {
        flexDirection: 'row',
        margin: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    emptyText: {
        fontSize: normalizeWidth(35),
        color: Colors.primary,
        marginLeft: 2
    },
    star: {
        position: 'relative',
        alignItems: 'center',
        height: 50,
        width: 50
    },
    nextGoalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    nextGoal: {
        fontSize: normalizeHeight(60),
        color: Colors.primary,
        marginLeft: 5
    },
    text: {
        fontSize: normalizeHeight(80)
    },
    info: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    badge: {
        zIndex: 1000
    }
})

export default HabitBadges;