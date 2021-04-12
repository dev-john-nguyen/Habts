import * as React from 'react';
import { Pressable, PressableProps, StyleSheet, TextInput, StyleProp } from 'react-native'
import { AsapText } from './StyledText';
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
            <AsapText style={[styles.text]}>{props.text}</AsapText>
        </Pressable>
    )
}

export function StyledSecondaryButton(props: PressableProps & ButtonAdditionalProps) {
    return (
        <Pressable {...props} style={({ pressed }) => [props.style, styles.container, { backgroundColor: pressed ? Colors.tertiary : Colors.secondary }]}>
            <AsapText style={styles.text}>{props.text}</AsapText>
        </Pressable>
    )
}

export function StyledDisabledButton(props: PressableProps & ButtonAdditionalProps) {
    return (
        <Pressable {...props} style={[props.style, styles.container, { backgroundColor: Colors.lightGrey }]}>
            <AsapText style={[styles.text]}>{props.text}</AsapText>
        </Pressable>
    )
}

export function StyledRedButton(props: PressableProps & ButtonAdditionalProps) {
    return (
        <Pressable {...props} style={({ pressed }) => [props.style, styles.container, { backgroundColor: pressed ? Colors.red : Colors.red }]}>
            <AsapText style={styles.text}>{props.text}</AsapText>
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
