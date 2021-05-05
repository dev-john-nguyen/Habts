import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { normalizeHeight } from '../../utils/styles';

const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome)

interface Props {
    goalIndex: number
}

export default ({ goalIndex }: Props) => {
    const sizeAdmin = useRef(new Animated.Value(0)).current;
    //should be order
    const star = (goalIndex % 2) < 1 ? 'star-o' : 'star';
    const color = goalIndex < 2 ? Colors.white : Colors.yellow;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(sizeAdmin, {
                useNativeDriver: false,
                duration: 1000,
                easing: Easing.inOut(Easing.exp),
                toValue: normalizeHeight(5)
            }),
            Animated.timing(sizeAdmin, {
                delay: 1000,
                useNativeDriver: false,
                duration: 1000,
                easing: Easing.inOut(Easing.exp),
                toValue: 0
            })
        ]).start()
    }, [])

    return (
        <AnimatedIcon name={star} color={color} style={[{ fontSize: sizeAdmin }, styles.star]} />
    )
}

const styles = StyleSheet.create({
    star: {
        position: 'absolute',
        top: normalizeHeight(2.5),
        alignSelf: 'center',
        zIndex: 10000
    }
})