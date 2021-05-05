import React, { useRef, useEffect } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { AsapTextBold } from '../StyledText';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const Congrats = ({ message }: { message: string }) => {
    const posTop = useRef(new Animated.Value(normalizeHeight(2))).current;
    const posLeft = useRef(new Animated.Value(-500)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(posTop, {
                useNativeDriver: false,
                toValue: normalizeHeight(10),
                duration: 5000,
            }),
            Animated.timing(posLeft, {
                useNativeDriver: false,
                toValue: normalizeWidth(1),
                duration: 5000,
            })
        ]).start()
    }, [])


    return (
        <Animated.View
            style={[styles.container, {
                top: posTop,
                left: posLeft
            }]}

        >
            <LinearGradient style={styles.gradient} colors={['transparent', `rgba(${Colors.primaryRgb}, .8`, Colors.white]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            <AsapTextBold style={styles.text}>{message}</AsapTextBold>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        transform: [{ rotate: '-30deg' }],
        zIndex: 100,
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    gradient: {
        width: 100,
        height: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        marginRight: 5
    },
    text: {
        fontSize: normalizeWidth(15),
        color: Colors.white
    }
})

export default Congrats;