import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Easing, View } from 'react-native';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import { AsapTextBold } from '../StyledText';

const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome)

interface Props {
    goalIndex: number
}

export default ({ goalIndex }: Props) => {
    const sizeAdmin = useRef(new Animated.Value(0)).current;
    const containerAdmin = useRef(new Animated.Value(0)).current;
    const rotateAdmin = useRef(new Animated.Value(0)).current;
    //should be order
    const star = (goalIndex % 2) < 1 ? 'star-o' : 'star';
    const color = goalIndex < 2 ? Colors.primary : Colors.yellow;

    var message = ''

    switch (goalIndex) {
        case 0:
            message = 'Congrats! You earn your first badge. Keep it going.';
            break;
        case 1:
            message = 'Another badge! This habit will be get easier and easier.'
            break;
        case 2:
            message = 'Wow! This is a breeze for you. One more badge to go!';
            break;
        case 3:
            message = 'Congratulations! You accomplished all four badges.';
            break;
        default:
            message = 'Congrats! You earn your first badge. Keep it going.';
    }

    useEffect(() => {
        Animated.parallel([
            Animated.sequence([
                Animated.timing(sizeAdmin, {
                    useNativeDriver: false,
                    duration: 1000,
                    easing: Easing.inOut(Easing.exp),
                    toValue: normalizeHeight(5)
                }),
                Animated.timing(sizeAdmin, {
                    delay: 2500,
                    useNativeDriver: false,
                    duration: 1000,
                    easing: Easing.inOut(Easing.exp),
                    toValue: 0
                })
            ]),
            Animated.sequence([
                Animated.timing(containerAdmin, {
                    useNativeDriver: false,
                    duration: 1000,
                    easing: Easing.inOut(Easing.exp),
                    toValue: 1
                }),
                Animated.timing(containerAdmin, {
                    delay: 2500,
                    useNativeDriver: false,
                    duration: 1000,
                    easing: Easing.inOut(Easing.exp),
                    toValue: 0
                })
            ]),
            Animated.sequence([
                Animated.timing(rotateAdmin, {
                    useNativeDriver: false,
                    duration: 1000,
                    easing: Easing.inOut(Easing.exp),
                    toValue: 1
                }),
                Animated.timing(rotateAdmin, {
                    delay: 2500,
                    useNativeDriver: false,
                    duration: 1000,
                    easing: Easing.inOut(Easing.exp),
                    toValue: 2
                })
            ])
        ]).start()
    }, [])

    return (
        <Animated.View style={[styles.container, {
            opacity: containerAdmin, transform: [{
                rotate:
                    rotateAdmin.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: ['0deg', '360deg', '0deg']
                    })
            }]
        }]}>
            <AnimatedIcon name={star} color={color} style={[styles.star, { fontSize: sizeAdmin }]} />
            <AsapTextBold style={styles.text}>{message}</AsapTextBold>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        zIndex: 10000,
        position: 'absolute',
        top: normalizeHeight(2.5),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 10,
        width: normalizeWidth(2)
    },
    star: {
    },
    text: {
        fontSize: normalizeHeight(60),
        color: Colors.primary,
    }
})