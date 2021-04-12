import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { normalizeHeight } from '../utils/styles';

export default ({ setStarRating, starRating, edit }: { setStarRating: (rating: number) => void, starRating: number, edit: boolean }) => {
    return (
        <View style={styles.container}>
            {new Array(5).fill(null).map((item, index) => {
                const curIndex = (index + 1)
                if (starRating >= curIndex) {
                    return <FontAwesome name="star" size={normalizeHeight(30)} color={Colors.white} style={styles.star} key={index} onPress={() => edit && setStarRating(curIndex)} />
                } else {
                    return <FontAwesome name="star-o" size={normalizeHeight(30)} color={Colors.primary} style={styles.star} key={index} onPress={() => edit && setStarRating(curIndex)} />
                }
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    star: {
        marginRight: 10
    }
})