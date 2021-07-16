import * as React from 'react';
import { TextInput } from 'react-native'
import Colors from '../constants/Colors';

export function StyledTextInput(props: TextInput['props'] & { placeholderTextColor?: string }) {
    return <TextInput {...props} placeholderTextColor={props.placeholderTextColor ? props.placeholderTextColor : Colors.grey} style={[props.style, { fontFamily: 'Cabin_400Regular' }]} />;
}
