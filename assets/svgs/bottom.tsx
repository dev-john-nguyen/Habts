import React from 'react';
import { SvgXml } from 'react-native-svg';
import Colors from '../../constants/Colors';

const bottom = `<svg viewBox="0 0 375 87" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M91.1449 17.8528L46.0742 15.0359C30.0304 14.0331 14.0367 17.6656 0 25.5V87H375V38.5L263.968 4.55414C249.851 0.23827 234.954 -0.898764 220.346 1.22466L111.767 17.0075C104.941 17.9998 98.0298 18.2831 91.1449 17.8528Z" fill="${Colors.primary}"/>
<path d="M82.3659 9.35243L0 32V88H375V32C354.032 13.9516 325.264 7.93753 298.821 16.0746L271.503 24.4814C255.472 29.4145 238.458 30.2363 222.027 26.8712L128.942 7.80728C113.511 4.64715 97.5529 5.17657 82.3659 9.35243Z" fill="${Colors.secondary}"/>
</svg>`


export default () => (
    <SvgXml xml={bottom} width='100%' height='100%' preserveAspectRatio='none' />
)