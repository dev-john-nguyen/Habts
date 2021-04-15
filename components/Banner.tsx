import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Pressable } from 'react-native';
import { BannerActionsProps, BannerProps } from '../services/banner/types';
import { AsapText } from './StyledText';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

interface Props {
    removeBanner: BannerActionsProps['removeBanner'];
    banner: BannerProps;
}

export default ({ removeBanner, banner }: Props) => {
    const topAdmin = useRef(new Animated.Value(-120)).current;

    useEffect(() => {
        if (!!banner.type && !!banner.message) {
            topAdmin.stopAnimation();

            Animated.sequence([
                Animated.timing(topAdmin, {
                    useNativeDriver: false,
                    toValue: 0,
                    easing: Easing.out(Easing.circle),
                    duration: 1000
                }),
                Animated.timing(topAdmin, {
                    useNativeDriver: false,
                    delay: 2500,
                    toValue: -120,
                    easing: Easing.inOut(Easing.circle),
                    duration: 500
                })
            ]).start()
        }
    }, [banner])

    const hide = () => {
        Animated.timing(topAdmin, {
            useNativeDriver: false,
            toValue: -120,
            easing: Easing.inOut(Easing.circle),
            duration: 500
        }).start(() => {
            removeBanner()
        })
    }

    const handleBackgroundColor = () => {
        switch (banner.type) {
            case 'error':
                return Colors.red;
            case 'warning':
                return Colors.yellow;
            case 'success':
            default:
                return Colors.green;
        }
    }



    return (
        <Animated.View style={[styles.container, { top: topAdmin, backgroundColor: handleBackgroundColor() }]}>
            <Pressable style={styles.messageContainer} onPress={hide}>
                <AsapText style={styles.messageText}>{banner.message}</AsapText>
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '90%',
        alignSelf: 'center',
        minHeight: (Layout.window.height / 8),
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        zIndex: 100
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: 20,
        zIndex: 120
    },
    messageText: {
        fontSize: 16,
        color: Colors.white
    }
})
