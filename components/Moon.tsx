import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { StyledText } from './StyledText';
import Colors from '../constants/Colors';
import { normalizeWidth } from '../utils/styles';

export default ({ onPress }: { onPress: () => void; }) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <StyledText style={styles.text}>New</StyledText>
            <View style={styles.crator1} />
            <View style={styles.crator2} />
            <View style={styles.crator3} />
            <View style={styles.crator4} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    crator1: {
        position: 'absolute',
        zIndex: -10,
        top: 10,
        left: 7,
        height: normalizeWidth(26),
        width: normalizeWidth(25),
        backgroundColor: Colors.lightGrey,
        borderRadius: 20,
        transform: [{ rotate: '-20deg' }]
    },
    crator2: {
        position: 'absolute',
        zIndex: -10,
        bottom: 10,
        right: 10,
        height: normalizeWidth(22),
        width: normalizeWidth(22),
        backgroundColor: Colors.lightGrey,
        borderRadius: 20,
    },
    crator3: {
        position: 'absolute',
        zIndex: -10,
        bottom: 10,
        left: 10,
        height: normalizeWidth(30),
        width: normalizeWidth(30),
        backgroundColor: Colors.lightGrey,
        borderRadius: 20,
    },
    crator4: {
        position: 'absolute',
        zIndex: -10,
        top: 10,
        right: 20,
        height: normalizeWidth(40),
        width: normalizeWidth(40),
        backgroundColor: Colors.lightGrey,
        borderRadius: 20,
    },
    container: {
        backgroundColor: Colors.veryLightGrey,
        borderRadius: 100,
        height: normalizeWidth(6),
        width: normalizeWidth(6),
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: Colors.primary,
        fontSize: normalizeWidth(25)
    }
})