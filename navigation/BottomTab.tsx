import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Image, Pressable } from 'react-native';
import { FontAwesome, Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import BottomSvg from '../assets/svgs/bottom';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import Layout from '../constants/Layout';
import CircleAdd from '../assets/svgs/CircleAdd';
import Gear from '../assets/svgs/Gear';

interface BottomTabProps {
    navtoNew: () => void;
    navToHabitHistory: () => void;
    navToSettings: () => void;
    expired: boolean;
}

export default ({ navtoNew, navToHabitHistory, navToSettings, expired }: BottomTabProps) => {
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
                <View style={[styles.menu, { justifyContent: expired ? 'flex-end' : 'space-between' }]}>
                    {!expired && <Pressable onPress={() => handleOnPress('New')} hitSlop={5} style={styles.menuItemAdd}>
                        <CircleAdd
                            color={Colors.white}
                        />
                    </Pressable>
                    }
                    <Pressable
                        onPress={() => handleOnPress('Settings')}
                        hitSlop={5}
                        style={styles.menuItemGear}
                    >
                        <Gear
                            color={Colors.white}
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
        justifyContent: 'flex-end'
    },
    bottomSvg: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    menuItemAdd: {
        height: normalizeWidth(12),
        width: normalizeWidth(12)
    },
    menuItemGear: {
        height: normalizeWidth(12),
        width: normalizeWidth(12)
    },
    content: { flex: 1, flexDirection: 'row' },
})