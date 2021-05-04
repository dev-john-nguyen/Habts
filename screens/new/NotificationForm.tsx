import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { StyledPrimaryButton, StyledDisabledButton, StyledSecondaryButton } from '../../components/StyledButton';
import { LatoText, AsapText } from '../../components/StyledText';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import { Entypo } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { arrayOfNums } from '../utils';

interface Props {
    notificationOn: boolean;
    setNotificationOn: (on: boolean) => void;
    notificationNum: number;
    setNotificationNum: (d: number) => void;
    handlePreviousStep: () => void;
    handleNextStep: () => void;
}

export default ({ notificationNum, notificationOn, setNotificationOn, setNotificationNum, handlePreviousStep, handleNextStep }: Props) => {

    return (
        <View style={styles.step}>
            <LatoText style={styles.infoText}>Up to an hour before,</LatoText>
            <AsapText style={styles.questionText}>At What Time Do You Want To Be Notified?</AsapText>
            <View style={styles.container}>

                {
                    notificationOn
                        ? <Entypo name="bell" size={normalizeHeight(30)} color={Colors.white} style={styles.bell} onPress={() => setNotificationOn(false)} />
                        : <Entypo name="sound-mute" size={normalizeHeight(30)} color={Colors.white} style={styles.bell} onPress={() => setNotificationOn(true)} />
                }

                <Picker
                    selectedValue={notificationNum}
                    onValueChange={(itemValue: any, itemIndex: number) => setNotificationNum(parseInt(itemValue))}
                    itemStyle={styles.pickerItemStyle}
                >
                    {arrayOfNums(61).map((item) => (
                        <Picker.Item label={item.toString()} value={item} key={item.toString()} />
                    ))}
                </Picker>
                <LatoText style={styles.text}>Mins Before</LatoText>
            </View>
            <View style={styles.buttonContainer}>
                <StyledSecondaryButton text='Previous' style={{ flex: .4 }} onPress={handlePreviousStep} />
                {
                    notificationNum >= 0 ? <StyledPrimaryButton text='Next' style={{ flex: .4 }} onPress={handleNextStep} />
                        : <StyledDisabledButton text='Next' style={{ flex: .4 }} />

                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    habitList: {
        padding: 5,
        paddingLeft: 10,
    },
    pickerContainer: {
        flex: 1
    },
    text: {
        fontSize: normalizeWidth(20),
        color: Colors.white
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bell: {},
    pickerItemStyle: {
        fontSize: normalizeWidth(10),
        color: Colors.white,
        padding: normalizeWidth(10),
        height: normalizeHeight(30),
        borderRadius: 10
    },
    step: {
        marginTop: 20,
        width: '100%',
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: normalizeHeight(20)
    },
    questionText: {
        textTransform: 'capitalize',
        fontSize: normalizeWidth(12),
        color: Colors.white
    },
    infoText: {
        margin: 5,
        marginLeft: 10,
        fontSize: normalizeWidth(25),
        color: Colors.white,
        fontStyle: 'italic'
    },
})

