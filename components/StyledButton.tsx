import * as React from 'react';
import { Pressable, PressableProps, StyleSheet, TextInput, StyleProp } from 'react-native'
import { StyledText, StyledTextBold } from './StyledText';
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
            <StyledTextBold style={[styles.text]}>{props.text}</StyledTextBold>
        </Pressable>
    )
}

export function StyledSecondaryButton(props: PressableProps & ButtonAdditionalProps) {
    return (
        <Pressable {...props} style={({ pressed }) => [props.style, styles.container, { backgroundColor: pressed ? Colors.tertiary : Colors.secondary }]}>
            <StyledTextBold style={styles.text}>{props.text}</StyledTextBold>
        </Pressable>
    )
}

export function StyledDisabledButton(props: PressableProps & ButtonAdditionalProps) {
    return (
        <Pressable {...props} style={[props.style, styles.container, { backgroundColor: Colors.lightGrey }]}>
            <StyledTextBold style={[styles.text]}>{props.text}</StyledTextBold>
        </Pressable>
    )
}

export function StyledRedButton(props: PressableProps & ButtonAdditionalProps) {
    return (
        <Pressable {...props} style={({ pressed }) => [props.style, styles.container, { backgroundColor: pressed ? `rgba(${Colors.redRgb},.8)` : Colors.red }]}>
            <StyledTextBold style={styles.text}>{props.text}</StyledTextBold>
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
