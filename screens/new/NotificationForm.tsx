import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { StyledPrimaryButton, StyledDisabledButton, StyledSecondaryButton } from '../../components/StyledButton';
import { StyledText, StyledTextBold } from '../../components/StyledText';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import { FontAwesome } from '@expo/vector-icons';

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
            <StyledTextBold style={styles.questionText}>Turn on reminders?</StyledTextBold>
            <StyledText style={styles.infoText}>You will be reminded at the time of which you selected to start your habit.</StyledText>
            <View style={styles.content}>
                {/* <Picker
                    selectedValue={notificationNum}
                    onValueChange={(itemValue: any, itemIndex: number) => setNotificationNum(parseInt(itemValue))}
                    itemStyle={styles.pickerItemStyle}
                >
                    {arrayOfNums(61).map((item) => (
                        <Picker.Item label={item.toString()} value={item} key={item.toString()} />
                    ))}
                </Picker> */}
                {/* <StyledText style={styles.text}>mins before</StyledText> */}
                {
                    notificationOn
                        ? <FontAwesome name="bell" size={normalizeHeight(20)} color={Colors.primary} style={styles.bell} onPress={() => setNotificationOn(false)} />
                        : <FontAwesome name="bell-slash" size={normalizeHeight(20)} color={Colors.primary} style={styles.bell} onPress={() => setNotificationOn(true)} />
                }
                {
                    notificationOn
                        ? <StyledTextBold style={styles.text}>On</StyledTextBold>
                        : <StyledTextBold style={styles.text}>Off</StyledTextBold>
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
        justifyContent: 'center'
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
        color: Colors.primary,
    },
    infoText: {
        fontSize: normalizeWidth(30),
        color: Colors.primary,
        marginBottom: normalizeHeight(25)
    },
})

