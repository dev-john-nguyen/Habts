import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Image, Pressable } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import BottomSvg from '../assets/svgs/bottom';
import { normalizeHeight } from '../utils/styles';
import Layout from '../constants/Layout';
import StarGazeMan from '../assets/svgs/stargazeman';

interface BottomTabProps {
    navtoNew: () => void;
    navToReviewHistory: () => void;
    navToHabitHistory: () => void;
    navToSettings: () => void;
}

export default ({ navtoNew, navToReviewHistory, navToHabitHistory, navToSettings }: BottomTabProps) => {
    const menuWidth: any = useRef(new Animated.Value(0)).current;
    const menuHeight: any = useRef(new Animated.Value(0)).current;

    const handleMenuView = () => menuWidth._value > 0 ? hideMenu() : showMenu()

    const hideMenu = () => {
        Animated.parallel([
            Animated.timing(menuWidth, {
                useNativeDriver: false,
                toValue: 0,
                easing: Easing.inOut(Easing.circle),
                duration: 500
            }),
            Animated.timing(menuHeight, {
                useNativeDriver: false,
                toValue: 0,
                easing: Easing.inOut(Easing.circle),
                duration: 500
            })
        ]).start()
    }

    const showMenu = () => {
        Animated.parallel([
            Animated.timing(menuWidth, {
                useNativeDriver: false,
                toValue: normalizeHeight(3),
                easing: Easing.inOut(Easing.circle),
                duration: 500
            }),
            Animated.timing(menuHeight, {
                useNativeDriver: false,
                toValue: normalizeHeight(8),
                easing: Easing.inOut(Easing.circle),
                duration: 500
            }),
        ]).start()
    }

    const handleOnPress = (screen: string) => {

        switch (screen) {
            case 'HabitHistory':
                navToHabitHistory()
                break;
            case 'ReviewHistory':
                navToReviewHistory()
                break;
            case 'New':
                navtoNew()
                break;
            case 'Settings':
                navToSettings()
        }

        hideMenu()
    }

    return (
        <View style={styles.container}>
            <View style={styles.stargaze}>
                <StarGazeMan />
            </View>
            <View style={styles.bottomSvg}>
                <BottomSvg />
            </View>
            <View style={styles.content}>
                <View style={styles.logo}>
                    <Image source={require('../assets/logo.png')} style={{ height: normalizeHeight(13), width: normalizeHeight(13), borderRadius: 20 }} />
                </View>
                <View style={styles.rightContainer}>
                    <View style={{ marginRight: 30 }}>
                        <Entypo
                            name="menu"
                            size={normalizeHeight(25)}
                            color={Colors.white}
                            onPress={handleMenuView}
                            style={{ zIndex: 10 }}
                        />
                        <Animated.View style={[styles.menuContainer, Colors.boxShadow, {
                            width: menuWidth,
                            height: menuHeight
                        }]}>
                            <View style={styles.menu}>
                                <Pressable
                                    onPress={() => handleOnPress('Settings')}
                                    hitSlop={5}
                                >
                                    <FontAwesome
                                        name="gear"
                                        size={normalizeHeight(30)}
                                        color={Colors.white}
                                        onPress={() => handleOnPress('Settings')}
                                    />
                                </Pressable>
                                <Pressable onPress={() => handleOnPress('ReviewHistory')} hitSlop={5}>
                                    <FontAwesome
                                        name="file-text"
                                        size={normalizeHeight(30)}
                                        color={Colors.white}
                                        onPress={() => handleOnPress('ReviewHistory')}
                                    />
                                </Pressable>

                                <Pressable
                                    onPress={() => handleOnPress('HabitHistory')}
                                    hitSlop={5}
                                >
                                    <Entypo
                                        name="archive"
                                        size={normalizeHeight(30)}
                                        color={Colors.white}
                                        onPress={() => handleOnPress('HabitHistory')}
                                    />
                                </Pressable>
                                <Pressable onPress={() => handleOnPress('New')} hitSlop={5}>
                                    <Entypo
                                        name="add-to-list"
                                        size={normalizeHeight(30)}
                                        color={Colors.white}
                                        onPress={() => handleOnPress('New')}
                                    />
                                </Pressable>
                            </View>
                        </Animated.View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: Layout.window.width,
        height: normalizeHeight(10)
    },
    stargaze: {
        position: 'absolute',
        height: Layout.window.width / 4,
        width: Layout.window.width / 4,
        top: -(Layout.window.width / 4.3),
        left: 70
    },
    menu: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        paddingBottom: 30,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    menuContainer: {
        position: 'absolute',
        borderRadius: 10,
        bottom: 0,
        right: 0,
        backgroundColor: Colors.secondary,
        overflow: 'hidden',
        borderColor: Colors.primary,
        borderWidth: 1
    },
    bottomSvg: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    content: { flex: 1, flexDirection: 'row' },
    logo: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    logoText: { fontSize: 20, color: Colors.white, marginLeft: 5 },
    rightContainer: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
})