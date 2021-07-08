import * as React from 'react';

import { Text, TextProps } from './Themed';

export function AsapText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Cabin_400Regular', letterSpacing: .5 }]} />;
}

export function AsapTextBold(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Cabin_700Bold' }]} />;
}

export function AsapTextMedium(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Cabin_500Medium' }]} />;
}

function checkItalic(style: any) {
  if (style && style.fontStyle && style.fontStyle == 'italic') {
    return 'Lato_400Regular_Italic'
  } else {
    return 'Lato_400Regular'
  }
}

export function LatoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: checkItalic(props.style) }]} />;
}

