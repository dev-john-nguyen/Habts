import React from 'react';
import { SvgXml } from 'react-native-svg';

const arrowLeftCircle = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#DC3333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.6666 8.33301L8.33325 11.6663M8.33325 8.33301L11.6666 11.6663L8.33325 8.33301Z" stroke="#DC3333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`

interface Props {
    color: string;
}

export default ({ color }: Props) => (
    <SvgXml xml={arrowLeftCircle} width='100%' height='100%' stroke={color} />
)