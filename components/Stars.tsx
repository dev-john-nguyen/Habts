import React, { useMemo, useState } from 'react';
import Layout from '../constants/Layout';
import { View } from 'react-native';
import Colors from '../constants/Colors';
import { randomIntFromInterval } from '../utils/tools';

interface StarProps {
    top: number;
    right: number;
    size: number;
}

interface Props {
    quantity: number;
    topMax: number;
    rightMax: number;
}
export default ({ quantity, rightMax, topMax }: Props) => {
    const [stars, setStars] = useState<StarProps[]>([])
    useMemo(() => {
        let store: StarProps[] = []
        for (let i = 0; i <= quantity; i++) {
            let top = randomIntFromInterval(10, topMax);
            let right = randomIntFromInterval(10, rightMax);
            let size = randomIntFromInterval(4, 5)
            store.push({
                top,
                right,
                size
            })
        }
        setStars(store)
    }, [])

    return (
        <>
            {stars.map(((star, i) => <View key={i.toString()} style={{ position: 'absolute', top: star.top, left: star.right, height: star.size, width: star.size, borderRadius: 50, backgroundColor: i % 2 < 1 ? Colors.white : Colors.primary, zIndex: -100 }} />))}
        </>
    )

}