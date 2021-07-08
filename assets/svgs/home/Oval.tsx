import React from 'react';
import { SvgXml } from 'react-native-svg';

const bg = `<svg width="93" height="15" viewBox="0 0 93 15" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="46.5" cy="7.5" rx="46.5" ry="7.5" />
</svg>`

interface Props {
    fillColor: string;
}

export default ({ fillColor }: Props) => (
    <SvgXml xml={bg} width='100%' height='100%' preserveAspectRatio='none' fill={fillColor} />
)