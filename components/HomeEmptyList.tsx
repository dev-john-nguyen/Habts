import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from "react-native"
import Meditating from "../assets/svgs/Meditating"
import { StyledPrimaryButton } from "./StyledButton"

interface Props {
    navToNew: () => void;
}

const HomeEmptyList = ({ navToNew }: Props) => {
    const posTop = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(Animated.timing(posTop, {
            useNativeDriver: false,
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.ease)
        })).start()
    }, [])

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.svgContainer, {
                top: posTop.interpolate({
                    inputRange: [0, .5, 1],
                    outputRange: [0, 10, 0]
                })
            }]}>
                <Meditating />
            </Animated.View>
            <StyledPrimaryButton text="Let's get started!" style={styles.button} onPress={navToNew} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    svgContainer: {
        width: '30%',
        height: 'auto'
    },
    button: {
        width: '70%'
    }
})

export default HomeEmptyList;