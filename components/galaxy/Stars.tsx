import React, { useState, useEffect, useRef } from 'react';
import { randomIntFromInterval } from '../../utils/tools';
import { StyleSheet, Animated, Easing } from 'react-native';
import Colors from '../../constants/Colors';
import { StyledText } from '../StyledText';
import { normalizeWidth, normalizeHeight } from '../../utils/styles';


interface Props {
    text: string;
    index: number;
    login?: true;
}


export default ({ text, index, login }: Props) => {
    const rotateAdmin = useRef(new Animated.Value(0)).current
    const [topBottom] = useState(randomIntFromInterval(40, normalizeWidth(2.5)));
    const [leftRight] = useState(randomIntFromInterval(40, normalizeWidth(2.5)));
    const [rand] = useState(randomIntFromInterval(1, 2));
    const [randToBottom] = useState(randomIntFromInterval(1, 2));
    const [randLeftRight] = useState(randomIntFromInterval(1, 2));
    useEffect(() => {
        Animated.loop(Animated.sequence([
            Animated.timing(rotateAdmin, {
                useNativeDriver: false,
                toValue: 2,
                duration: 20000,
                easing: Easing.linear
            })
        ])).start()
    }, [])

    const renderBackColor = () => {
        if (index % 10 == 0 && index != 0) {
            return Colors.yellow
        }
        if (rand % 2 >= 1) return Colors.white;
        return Colors.primary
    }

    const renderColor = () => {
        if (index % 10 == 0 && index != 0) {
            return Colors.white
        }
        if (rand % 2 >= 1) return Colors.primary;
        return Colors.white
    }

    return (
        <Animated.View style={[styles.star,
        {
            height: login ? normalizeWidth(10) : normalizeWidth(15),
            width: login ? normalizeWidth(10) : normalizeWidth(15),
            top: randToBottom % 2 < 1 ? topBottom : undefined,
            bottom: randToBottom % 2 >= 1 ? topBottom : undefined,
            left: randLeftRight % 2 < 1 ? leftRight : undefined,
            right: randLeftRight % 2 >= 1 ? leftRight : undefined,
            backgroundColor: renderBackColor(),
            transform: [{
                rotate: rotateAdmin.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: ['0deg', '180deg', '360deg']
                })
            }, { rotateZ: '180deg' }, { perspective: 800 }]
        }
        ]}>
            <StyledText style={[styles.text, { color: renderColor() }]}>{text}</StyledText>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    star: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: -1,
        borderRadius: 500,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: normalizeWidth(50)
    }
})