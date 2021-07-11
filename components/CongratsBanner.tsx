import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Easing, View, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import { StyledTextBold, StyledText } from './StyledText';
import Badge from '../assets/svgs/badge';
import Fireworks from '../assets/svgs/Fireworks';
import CelebratePeople from '../assets/svgs/CelebratePeople';
import { StyledTextInput } from './StyledTextInput';
import { StyledPrimaryButton } from './StyledButton';

const AnimatedFireWorks = Animated.createAnimatedComponent(Fireworks)

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
    const [btnText, setBtnText] = useState('Got it!')
    const fireworkColor = useRef(new Animated.Value(0)).current;

    const setBadgeData = () => {
        //should be order
        let badgeColor = '';
        let badgeOutline = true;
        let message = '';

        switch (goalIndex) {
            case 1:
                message = "You are a lot more capable than you think. That's half of the badges so far. Keep going!";
                badgeColor = Colors.primary;
                badgeOutline = false;
                break;
            case 2:
                message = "That's already the third badge. I like your ambition! One more to go!";
                badgeColor = Colors.yellow;
                badgeOutline = true;
                break;
            case 3:
                message = 'I knew you could do it. You completed all four badges. You are a rockstar.';
                badgeColor = Colors.yellow;
                badgeOutline = false;
                break;
            case 0:
            default:
                message = "Your first badge! Hardest badge to earn. Many more to go. Dont stop!";
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
        setBadgeData();
        onOpen();
        // if (goalIndex !== undefined) {
        //     setBadgeData()
        //     onOpen()
        // } else {
        //     onClose()
        // }
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
            }),
        ]).start()
        Animated.loop(Animated.timing(fireworkColor, {
            useNativeDriver: false,
            duration: 1000,
            easing: Easing.inOut(Easing.exp),
            toValue: 1
        })).start()
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
            setBtnText('Got it!')
        })
        fireworkColor.stopAnimation()
    }

    const onBtnPressOut = () => {
        setTimeout(() => {
            onClose()
        }, 500)
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
            <View style={{ flex: 1, marginBottom: 20 }}>
                <StyledTextBold style={styles.headerText}>Congratulations</StyledTextBold>
            </View>
            <View style={{ flex: 1, height: normalizeHeight(6), marginBottom: 20 }}>
                <Badge outlineBadge={badge.outline} fill={badge.color} />
            </View>
            <View style={{ flex: 1, marginBottom: 20 }}>
                <StyledText style={styles.text}>{badge.message}</StyledText>
            </View>

            <StyledPrimaryButton
                text={btnText}
                onPressIn={() => setBtnText("I'm a rockstar")}
                onPressOut={onBtnPressOut}

            />

            <View style={[styles.fireworks, { right: '5%', zIndex: 1000 }]}>
                <AnimatedFireWorks color={fireworkColor.interpolate({
                    inputRange: [0, .5, 1],
                    outputRange: [Colors.red, Colors.green, Colors.orange]
                })} />
            </View>
            <View style={[styles.fireworks, { left: '5%', top: '10%', zIndex: -1 }]}>
                <AnimatedFireWorks color={fireworkColor.interpolate({
                    inputRange: [0, .5, 1],
                    outputRange: [Colors.green, Colors.orange, Colors.red]
                })} />
            </View>
            <View style={[styles.fireworks, { left: '5%', bottom: '40%' }]}>
                <CelebratePeople />
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        zIndex: 10000,
        position: 'absolute',
        top: normalizeHeight(6),
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 30,
        width: '90%',
        backgroundColor: Colors.white
    },
    fireworks: {
        position: 'absolute',
        width: '30%',
        height: '30%',
        zIndex: -10
    },
    headerText: {
        fontSize: normalizeWidth(14),
        color: Colors.primary,
        width: '100%',
        textAlign: 'center'
    },
    text: {
        fontSize: normalizeWidth(25),
        color: Colors.primary,
    }
})