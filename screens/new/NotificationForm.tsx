import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { StyledPrimaryButton, StyledDisabledButton, StyledSecondaryButton } from '../../components/StyledButton';
import { AsapText, AsapTextBold } from '../../components/StyledText';
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
        <View style={styles.container}>
            <AsapText style={styles.infoText}>Up to an hour before,</AsapText>
            <AsapTextBold style={styles.questionText}>At What Time Do You Want To Be Notified?</AsapTextBold>
            <View style={styles.content}>
                <Picker
                    selectedValue={notificationNum}
                    onValueChange={(itemValue: any, itemIndex: number) => setNotificationNum(parseInt(itemValue))}
                    itemStyle={styles.pickerItemStyle}
                >
                    {arrayOfNums(61).map((item) => (
                        <Picker.Item label={item.toString()} value={item} key={item.toString()} />
                    ))}
                </Picker>
                <AsapText style={styles.text}>mins before</AsapText>
                {
                    notificationOn
                        ? <Entypo name="bell" size={normalizeHeight(35)} color={Colors.primary} style={styles.bell} onPress={() => setNotificationOn(false)} />
                        : <Entypo name="sound-mute" size={normalizeHeight(35)} color={Colors.primary} style={styles.bell} onPress={() => setNotificationOn(true)} />
                }

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
    container: {
        backgroundColor: Colors.contentBg,
        padding: normalizeWidth(15),
        borderRadius: 20,
    },
    habitList: {
        padding: 5,
        paddingLeft: 10,
    },
    pickerContainer: {
        flex: 1
    },
    text: {
        fontSize: normalizeWidth(25),
        color: Colors.primary
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    bell: {
        marginLeft: 5
    },
    pickerItemStyle: {
        fontSize: normalizeWidth(25),
        color: Colors.primary,
        padding: normalizeWidth(10),
        height: normalizeHeight(10),
        borderRadius: 20
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: normalizeHeight(20)
    },
    questionText: {
        textTransform: 'capitalize',
        fontSize: normalizeWidth(15),
        color: Colors.primary
    },
    infoText: {
        fontSize: normalizeWidth(30),
        color: Colors.primary,
    },
})

