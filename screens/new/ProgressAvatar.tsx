import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Layout from '../../constants/Layout';;
import { normalizeHeight, normalizeWidth } from '../../utils/styles';

export default ({ step }: { step: number }) => {
    const runnerPosition = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(runnerPosition, {
            useNativeDriver: false,
            toValue: step === 0 ? 0 : (Layout.window.width / (12 - step)),
            easing: Easing.inOut(Easing.circle),
            duration: 500
        }).start()
    }, [step])
    return (
        <View style={styles.container}>
            <Animated.View style={[{
                left: runnerPosition,
            }, styles.runner]}>

            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        justifyContent: 'flex-end',
        zIndex: -1,
        width: '100%',
        height: normalizeHeight(30)
    },
    runner: {
        height: normalizeHeight(9),
        width: normalizeHeight(9),
        transform: [{ scaleX: -1 }, { rotate: '-80deg' }],
        top: normalizeHeight(9)
    },
})

