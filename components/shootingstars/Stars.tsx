import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native'
import { normalizeWidth, normalizeHeight } from '../../utils/styles';
import Colors from '../../constants/Colors';
import { randomIntFromInterval } from '../../utils/tools';
import { LinearGradient } from 'expo-linear-gradient';
import { dailyGoals } from '../../services/habits/utils/variables';
const Stars = ({ count }: { count: number }) => {
    const posTop = useRef(new Animated.Value(randomIntFromInterval(normalizeHeight(2), normalizeHeight(1)))).current;
    const posLeft = useRef(new Animated.Value(randomIntFromInterval(1, normalizeWidth(10)))).current;
    const opacity = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        const randDuration = randomIntFromInterval(100, 2000);
        const randOpacityDur = randomIntFromInterval(500, 1000);
        const randDely = randomIntFromInterval(1000, 10000);
        const randTop = randomIntFromInterval(1, normalizeHeight(15));

        Animated.parallel([
            Animated.timing(posTop, {
                useNativeDriver: false,
                toValue: randTop,
                duration: randDuration,
                easing: Easing.linear,
                delay: randDely
            }),
            Animated.timing(posLeft, {
                useNativeDriver: false,
                toValue: normalizeWidth(1),
                duration: randDuration,
                easing: Easing.linear,
                delay: randDely
            }),
            Animated.timing(opacity, {
                useNativeDriver: false,
                toValue: 2,
                duration: randOpacityDur,
                delay: randDely
            })
        ]).start(() => {
            opacity.setValue(0)
        })
    }, [])

    const renderStar = () => {
        let randNum;
        const dailyGoalsObj = dailyGoals();
        if (count >= dailyGoalsObj.four.total) {
            randNum = randomIntFromInterval(1, 4)
        } else if (count >= dailyGoalsObj.three.total) {
            randNum = randomIntFromInterval(1, 3)
        } else if (count >= dailyGoalsObj.two.total) {
            randNum = randomIntFromInterval(1, 2)
        } else {
            randNum = 1
        }

        switch (randNum) {
            case 4:
                return <LinearGradient style={styles.tail} colors={[Colors.primary, Colors.yellow]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            case 3:
                return <LinearGradient style={styles.tail} colors={[Colors.primary, Colors.yellow]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            case 2:
                return <LinearGradient style={styles.tail} colors={[Colors.primary, Colors.white]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            case 1:
            default:
                return <LinearGradient style={styles.tail} colors={[Colors.primary, Colors.white]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />

        }
    }

    return (
        <Animated.View
            style={[styles.container, {
                top: posTop,
                left: posLeft,
                opacity: opacity.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, 1, 0]
                })
            }]}
        >
            {renderStar()}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        flexDirection: 'row',
        transform: [{ rotate: '-45deg' }]
    },
    tail: {
        width: normalizeWidth(10),
        height: normalizeWidth(90),
        borderRadius: 5,
    }
})

export default Stars;