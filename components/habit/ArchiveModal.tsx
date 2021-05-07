import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, ActivityIndicator } from 'react-native';
import { AsapText } from '../StyledText';
import Layout from '../../constants/Layout';
import { StyledPrimaryButton, StyledSecondaryButton, StyledRedButton } from '../StyledButton';
import Colors from '../../constants/Colors';
import { normalizeHeight } from '../../utils/styles';

export default ({ onModalResponse, headerText, showModal, loading }: { onModalResponse: () => void, headerText: string, showModal: boolean, loading: boolean }) => {
    const modalWidth = useRef(new Animated.Value(0)).current;
    const modalHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showModal) {
            Animated.parallel([
                Animated.timing(modalWidth, {
                    useNativeDriver: false,
                    toValue: normalizeHeight(4),
                    easing: Easing.inOut(Easing.circle),
                    duration: 500
                }),
                Animated.timing(modalHeight, {
                    useNativeDriver: false,
                    toValue: normalizeHeight(4.5),
                    easing: Easing.inOut(Easing.circle),
                    duration: 500
                })
            ]).start()
        } else {
            Animated.parallel([
                Animated.timing(modalWidth, {
                    useNativeDriver: false,
                    toValue: 0,
                    easing: Easing.inOut(Easing.circle),
                    duration: 500
                }),
                Animated.timing(modalHeight, {
                    useNativeDriver: false,
                    toValue: 0,
                    easing: Easing.inOut(Easing.circle),
                    duration: 500
                })
            ]).start(() => modalHeight.setValue(0))
        }
    }, [showModal])

    return (
        <Animated.View style={{
            width: modalWidth,
            height: modalHeight,
            position: 'absolute',
            alignSelf: 'center',
            overflow: 'hidden',
            top: -5
        }}>
            <View style={styles.container}>
                <View style={styles.modalContent}>
                    <AsapText style={styles.modalHeader}>{headerText}</AsapText>
                    <StyledRedButton
                        style={styles.modalButton}
                        text={loading ? <ActivityIndicator color={Colors.white} /> : "I'm sure"}
                        onPress={onModalResponse}
                    />
                </View>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: normalizeHeight(4),
        height: normalizeHeight(4.5),
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 20,
        paddingTop: 20
    },
    modalContent: {
        margin: 10,
        padding: 5
    },
    modalHeader: {
        fontSize: normalizeHeight(50),
        color: Colors.white
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    modalButton: {
        alignSelf: 'stretch',
        marginTop: 10
    }
})

