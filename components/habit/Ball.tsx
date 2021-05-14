import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, PanResponder, Easing } from 'react-native';
import { normalizeWidth } from '../../utils/styles';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { AsapText } from '../StyledText';
import { getMonthShort } from '../../utils/tools';

interface Props {
    index: number;
    jarHeight: number;
    dateCompleted: Date;
    resetBalls: number;
}

export default ({ index, jarHeight, dateCompleted, resetBalls }: Props) => {
    const ballPositionY: any = useRef(new Animated.Value(-jarHeight)).current;
    const ballPositionX: any = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        ballPositionY.setValue(-jarHeight);
        ballPositionX.setValue(0);
        Animated.parallel([
            Animated.timing(ballPositionX, {
                toValue: 0,
                delay: index * 50,
                duration: 2000,
                useNativeDriver: false
            }),
            Animated.timing(ballPositionY, {
                toValue: 0,
                delay: index * 50,
                duration: 2000,
                easing: Easing.bounce,
                useNativeDriver: false
            })
        ]).start()
    }, [resetBalls])

    return (
        <Animated.View
            style={{
                transform: [{ translateX: ballPositionX }, { translateY: ballPositionY }]
            }}
        >
            <View
                style={styles.ball}
            >
                <AsapText style={styles.ballText}>{dateCompleted.getDate()}</AsapText>
                <AsapText style={styles.ballSubText}>{getMonthShort(dateCompleted)}</AsapText>
                <LinearGradient
                    colors={[`rgba(255,255,255,.2)`, Colors.secondary, Colors.primary]}
                    style={styles.ballGlare}
                />
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    ball: {
        backgroundColor: Colors.primary,
        height: normalizeWidth(7),
        width: normalizeWidth(7),
        borderRadius: 100,
        padding: 10,
        alignContent: 'center',
        alignItems: 'center'
    },
    ballText: {
        fontSize: normalizeWidth(20),
        color: Colors.white
    },
    ballSubText: {
        fontSize: normalizeWidth(30),
        color: Colors.white
    },
    ballGlare: {
        position: 'absolute',
        right: 0,
        top: 6,
        width: 25,
        height: 5,
        borderRadius: 10,
        transform: [{ rotate: '45deg' }]
    },
})

