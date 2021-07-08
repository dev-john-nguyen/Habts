import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Easing, View, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { normalizeHeight } from '../utils/styles';
import { StyledTextBold, StyledText } from './StyledText';
import Badge from '../assets/svgs/badge';

interface Props {
    goalIndex: number | undefined;
}

export default ({ goalIndex }: Props) => {
    const sizeAdmin = useRef(new Animated.Value(0)).current;
    const opacityAdmin = useRef(new Animated.Value(0)).current;
    const rotateAdmin = useRef(new Animated.Value(0)).current;
    const [badge, setBadge] = useState({
        color: Colors.primary,
        outline: true,
        message: 'Hi'
    })
    const [hidden, setHidden] = useState(true);

    const setBadgeData = () => {
        //should be order
        let badgeColor = '';
        let badgeOutline = true;
        let message = '';

        switch (goalIndex) {
            case 1:
                message = "Congrats on earning the second badge! That's half of the badges so far. Keep going!";
                badgeColor = Colors.primary;
                badgeOutline = false;
                break;
            case 2:
                message = "That's already the third badge. I like your ambition! One more to go!";
                badgeColor = Colors.yellow;
                badgeOutline = true;
                break;
            case 3:
                message = 'And just like that. You earned the final badge. You are a rockstar.';
                badgeColor = Colors.yellow;
                badgeOutline = false;
                break;
            case 0:
            default:
                message = "Congratulations on earning the first badge! Hardest badge to earn. Dont stop!";
                badgeColor = Colors.primary;
                badgeOutline = true;
        }

        setBadge({
            color: badgeColor,
            outline: badgeOutline,
            message: message
        })

    }

    useEffect(() => {
        if (goalIndex !== undefined) {
            setBadgeData()
            onOpen()
        } else {
            onClose()
        }
    }, [goalIndex])

    const onOpen = () => {
        setHidden(false);
        Animated.parallel([
            Animated.timing(sizeAdmin, {
                useNativeDriver: false,
                duration: 1000,
                easing: Easing.inOut(Easing.exp),
                toValue: normalizeHeight(5)
            }),
            Animated.timing(opacityAdmin, {
                useNativeDriver: false,
                duration: 1000,
                easing: Easing.inOut(Easing.exp),
                toValue: 1
            }),
            Animated.timing(rotateAdmin, {
                useNativeDriver: false,
                duration: 1000,
                easing: Easing.inOut(Easing.exp),
                toValue: 1
            })
        ]).start()
    }

    const onClose = () => {
        Animated.parallel([
            Animated.timing(sizeAdmin, {
                useNativeDriver: false,
                duration: 1000,
                easing: Easing.inOut(Easing.exp),
                toValue: 0
            }),
            Animated.timing(opacityAdmin, {
                useNativeDriver: false,
                duration: 1000,
                easing: Easing.inOut(Easing.exp),
                toValue: 0
            }),
            Animated.timing(rotateAdmin, {
                useNativeDriver: false,
                duration: 1000,
                easing: Easing.inOut(Easing.exp),
                toValue: 2
            })
        ]).start(() => {
            setHidden(true)
        })
    }

    if (hidden) {
        return <></>
    }

    return (
        <Animated.View style={[styles.container, Colors.boxShadow, {
            opacity: opacityAdmin, transform: [{
                rotate:
                    rotateAdmin.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: ['0deg', '360deg', '0deg']
                    })
            }]
        }]}>
            <Pressable onPress={onClose} style={{ alignSelf: 'flex-end' }} hitSlop={5}>
                <FontAwesome name='close' color={Colors.primary} size={normalizeHeight(50)} />
            </Pressable>
            <View style={{ flex: 1, marginBottom: 10 }}>
                <StyledTextBold style={styles.headerText}>Badge</StyledTextBold>
            </View>
            <View style={{ flex: 1, height: normalizeHeight(6), marginBottom: 10 }}>
                <Badge outlineBadge={badge.outline} fill={badge.color} />
            </View>
            <View style={{ flex: 1 }}>
                <StyledText style={styles.text}>{badge.message}</StyledText>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        zIndex: 10000,
        position: 'absolute',
        top: normalizeHeight(15),
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        backgroundColor: Colors.white
    },
    headerText: {
        fontSize: normalizeHeight(20),
        color: Colors.primary,
        width: '100%',
        textAlign: 'center'
    },
    text: {
        fontSize: normalizeHeight(50),
        color: Colors.primary,
    }
})