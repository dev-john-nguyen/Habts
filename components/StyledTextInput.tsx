import * as React from 'react';
import { TextInput } from 'react-native'
import Colors from '../constants/Colors';

export function StyledTextInput(props: TextInput['props']) {
    return <TextInput {...props} placeholderTextColor={Colors.lightGrey} style={[props.style, { fontFamily: 'Asap_400Regular', letterSpacing: .5 }]} />;
}
