import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Image, Pressable } from 'react-native';
import { FontAwesome, Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import BottomSvg from '../assets/svgs/bottom';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import Layout from '../constants/Layout';

interface BottomTabProps {
    navtoNew: () => void;
    navToHabitHistory: () => void;
    navToSettings: () => void;
}

export default ({ navtoNew, navToHabitHistory, navToSettings }: BottomTabProps) => {
    const handleOnPress = (screen: string) => {
        switch (screen) {
            case 'HabitHistory':
                navToHabitHistory()
                break;
            case 'New':
                navtoNew()
                break;
            case 'Settings':
                navToSettings()
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.bottomSvg}>
                <BottomSvg />
            </View>
            <View style={styles.content}>
                <View style={styles.menu}>
                    <Pressable onPress={() => handleOnPress('New')} hitSlop={5}>
                        <FontAwesome5
                            name="calendar-plus"
                            size={normalizeHeight(30)}
                            color={Colors.white}
                            onPress={() => handleOnPress('New')}
                        />
                    </Pressable>
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
    menu: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginRight: normalizeWidth(12),
        marginLeft: normalizeWidth(4.5),
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    bottomSvg: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    content: { flex: 1, flexDirection: 'row' },
})