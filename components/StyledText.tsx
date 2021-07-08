import * as React from 'react';

import { Text, TextProps } from './Themed';

export function StyledText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Cabin_400Regular' }]} />;
}

export function StyledTextBold(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Cabin_700Bold' }]} />;
}

export function StyledTextMedium(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Cabin_500Medium' }]} />;
}