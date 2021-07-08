import React from 'react';
import { SvgXml } from 'react-native-svg';
import Colors from '../../../constants/Colors';

const bg = `<svg viewBox="0 0 373 317" xmlns="http://www.w3.org/2000/svg">
<path d="M219 194.5C149.5 302.5 135 285 0 317V0H375.5V168.5C365.333 190 274.6 108.1 219 194.5Z" fill=${Colors.primary}/>
</svg>`

interface Props {

}

export default ({ }: Props) => (
    <SvgXml xml={bg} width='100%' height='100%' preserveAspectRatio='none' />
)