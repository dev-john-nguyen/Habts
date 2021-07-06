import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
    circleColor: string;
    squareColor: string;
}

export default ({ circleColor, squareColor }: Props) => (
    <View
        style={[styles.container, {
            backgroundColor: circleColor,
        }]}
    >
        <View
            style={[styles.content, {
                borderColor: squareColor
            }]}
        />
    </View>
)

const styles = StyleSheet.create({
    container: {
        height: '80%',
        width: '80%',
        borderRadius: 10000,
        padding: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        borderRadius: 1000,
        borderWidth: 1.5,
        height: '90%',
        width: '90%',
    }
})