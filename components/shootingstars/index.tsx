import React from 'react';
import { View, StyleSheet } from 'react-native';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import Stars from './Stars';

const ShootingStars = ({ count }: { count: number }) => {
    return (
        <View style={styles.container}>
            {new Array(count <= 66 ? count : 66).fill('shooting').map((val, key) => (
                <Stars key={key} count={count} />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: normalizeHeight(1),
        width: normalizeWidth(1),
        zIndex: -1
    }
})

export default ShootingStars;