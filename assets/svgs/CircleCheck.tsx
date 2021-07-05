import React from 'react';
import { SvgXml } from 'react-native-svg';

const circleChecked = `<svg width="43" height="43" viewBox="0 0 43 43" xmlns="http://www.w3.org/2000/svg">
<path d="M21.5 37.625C30.4056 37.625 37.625 30.4056 37.625 21.5C37.625 12.5944 30.4056 5.375 21.5 5.375C12.5944 5.375 5.375 12.5944 5.375 21.5C5.375 30.4056 12.5944 37.625 21.5 37.625Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.125 21.4993L19.7083 25.0827L26.875 17.916" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

interface Props {
    color: string;
}

export default ({ color }: Props) => (
    <SvgXml xml={circleChecked} width='100%' height='100%' fill={color} />
)