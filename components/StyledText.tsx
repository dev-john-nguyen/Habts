import * as React from 'react';

import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
}

export function AsapText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Asap_400Regular' }]} />;
}

export function AsapTextBold(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Asap_700Bold' }]} />;
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

