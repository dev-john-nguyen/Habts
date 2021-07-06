import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, ActivityIndicator, Pressable } from 'react-native';
import { AsapTextMedium } from '../StyledText';
import { StyledRedButton } from '../StyledButton';
import Colors from '../../constants/Colors';
import { normalizeHeight } from '../../utils/styles';

interface Props {
    onModalResponse: () => void,
    headerText: string,
    showModal: boolean,
    loading: boolean,
    onClose: () => void;
}

export default ({ onModalResponse, headerText, showModal, loading, onClose }: Props) => {
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
            <Pressable style={styles.container} onPress={onClose}>
                <View style={styles.modalContent}>
                    <AsapTextMedium style={styles.modalHeader}>{headerText}</AsapTextMedium>
                    <StyledRedButton
                        style={styles.modalButton}
                        text={loading ? <ActivityIndicator color={Colors.white} /> : "I'm sure"}
                        onPress={onModalResponse}
                    />
                </View>
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: normalizeHeight(5),
        height: normalizeHeight(5),
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.secondary,
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        paddingTop: 20
    },
    modalContent: {
        margin: 10,
        padding: 5
    },
    modalHeader: {
        fontSize: normalizeHeight(55),
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

