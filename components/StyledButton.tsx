import * as React from 'react';
import { Pressable, PressableProps, StyleSheet, TextInput, StyleProp } from 'react-native'
import { AsapText, AsapTextBold } from './StyledText';
import Colors from '../constants/Colors';
import { normalizeHeight } from '../utils/styles';

//HAVENT COnfigured this ... don't use !

interface ButtonAdditionalProps {
    textInputProps?: TextInput['props'];
    text: any;
    style?: StyleProp<any>
}

export function StyledPrimaryButton(props: PressableProps & ButtonAdditionalProps) {
    return (
        <Pressable {...props} style={({ pressed }) => [props.style, styles.container, { backgroundColor: pressed ? Colors.secondary : Colors.primary }]}>
            <AsapTextBold style={[styles.text]}>{props.text}</AsapTextBold>
        </Pressable>
    )
}

export function StyledSecondaryButton(props: PressableProps & ButtonAdditionalProps) {
    return (
        <Pressable {...props} style={({ pressed }) => [props.style, styles.container, { backgroundColor: pressed ? Colors.tertiary : Colors.secondary }]}>
            <AsapTextBold style={styles.text}>{props.text}</AsapTextBold>
        </Pressable>
    )
}

export function StyledDisabledButton(props: PressableProps & ButtonAdditionalProps) {
    return (
        <Pressable {...props} style={[props.style, styles.container, { backgroundColor: Colors.lightGrey }]}>
            <AsapTextBold style={[styles.text]}>{props.text}</AsapTextBold>
        </Pressable>
    )
}

export function StyledRedButton(props: PressableProps & ButtonAdditionalProps) {
    return (
        <Pressable {...props} style={({ pressed }) => [props.style, styles.container, { backgroundColor: pressed ? Colors.red : Colors.red }]}>
            <AsapTextBold style={styles.text}>{props.text}</AsapTextBold>
        </Pressable>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 20,
        alignItems: 'center'
    },
    text: {
        fontSize: normalizeHeight(50),
        color: Colors.white
    }
})
