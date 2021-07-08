import React from 'react';
import { View, StyleSheet, Pressable, StyleProp } from 'react-native';
import { StyledTextBold, StyledTextMedium } from '../../components/StyledText';
import { SequenceType, SequenceProps, WeekDay } from '../../services/habits/types';
import { StyledSecondaryButton, StyledPrimaryButton } from '../../components/StyledButton';
import { BannerActionsProps } from '../../services/banner/types';
import Colors from '../../constants/Colors';
import { FlatList } from 'react-native-gesture-handler';
import { normalizeWidth, normalizeHeight } from '../../utils/styles';

interface Props {
    sequence: SequenceProps;
    setSequence: (sequence: SequenceProps) => void;
    handleNextStep: () => void;
    handlePreviousStep: () => void;
    setBanner: BannerActionsProps['setBanner'];
}

const numberArray: number[] = [];

for (var i = 1; i <= 28; i++) {
    numberArray.push(i);
}


export default ({ sequence, setSequence, handleNextStep, handlePreviousStep, setBanner }: Props) => {

    const onNextPress = () => {
        if (sequence.type === SequenceType.monthly && sequence.value.length < 1) {
            return setBanner('error', 'Please select day of the month.')
        }

        if (sequence.type === SequenceType.weekly && sequence.value.length < 1) {
            return setBanner('error', 'Please select a day in the week that you would want to implement the habit.')
        }

        handleNextStep()
    }

    const handleValueChange = (dayOfWeek: number) => {
        const foundValue = sequence.value.findIndex(val => val === dayOfWeek)
        if (foundValue >= 0) {
            sequence.value.splice(foundValue, 1);
            setSequence({ ...sequence })
        } else {
            setSequence({ ...sequence, value: [...sequence.value, dayOfWeek] })
        }
    }

    const renderDayStyles = (dayOfWeek: number): StyleProp<any> => {
        const foundValue = sequence.value.findIndex(val => val === dayOfWeek)
        if (foundValue >= 0) {
            return [styles.weekDay, styles.weekDayActive]
        } else {
            return styles.weekDay
        }
    }

    const isSelectedDay = (dayOfWeek: number): StyleProp<any> => {
        const foundValue = sequence.value.findIndex(val => val === dayOfWeek)
        if (foundValue >= 0) {
            return true
        } else {
            return false
        }
    }

    const renderWeekly = () => (
        <View style={styles.weekContainer}>
            <Pressable onPress={() => handleValueChange(0)} style={() => renderDayStyles(0)}>
                <StyledTextMedium style={[styles.weekDayText, { color: isSelectedDay(0) ? Colors.white : Colors.primary }]}>Sunday</StyledTextMedium>
            </Pressable>
            <Pressable onPress={() => handleValueChange(1)} style={() => renderDayStyles(1)}>
                <StyledTextMedium style={[styles.weekDayText, { color: isSelectedDay(1) ? Colors.white : Colors.primary }]}>Monday</StyledTextMedium>
            </Pressable>
            <Pressable onPress={() => handleValueChange(2)} style={() => renderDayStyles(2)}>
                <StyledTextMedium style={[styles.weekDayText, { color: isSelectedDay(2) ? Colors.white : Colors.primary }]}>Tuesday</StyledTextMedium>
            </Pressable>
            <Pressable onPress={() => handleValueChange(3)} style={() => renderDayStyles(3)}>
                <StyledTextMedium style={[styles.weekDayText, { color: isSelectedDay(3) ? Colors.white : Colors.primary }]}>Wednesday</StyledTextMedium>
            </Pressable>
            <Pressable onPress={() => handleValueChange(4)} style={() => renderDayStyles(4)}>
                <StyledTextMedium style={[styles.weekDayText, { color: isSelectedDay(4) ? Colors.white : Colors.primary }]}>Thursday</StyledTextMedium>
            </Pressable>
            <Pressable onPress={() => handleValueChange(5)} style={() => renderDayStyles(5)}>
                <StyledTextMedium style={[styles.weekDayText, { color: isSelectedDay(5) ? Colors.white : Colors.primary }]}>Friday</StyledTextMedium>
            </Pressable>
            <Pressable onPress={() => handleValueChange(6)} style={() => renderDayStyles(6)}>
                <StyledTextMedium style={[styles.weekDayText, { color: isSelectedDay(6) ? Colors.white : Colors.primary }]}>Saturday</StyledTextMedium>
            </Pressable>
        </View>
    )

    const renderMonthly = () => (
        <FlatList
            data={numberArray}
            style={styles.monthlyContainer}
            renderItem={({ item }) => {
                let isSelected = sequence.value.find(day => day == item);
                return (
                    <Pressable
                        onPress={() => handleValueChange(item)}
                        style={[styles.monthly, isSelected ? styles.monthlyActive : undefined]}
                    >
                        <StyledTextMedium style={[styles.monthlyText, { color: isSelected ? Colors.white : Colors.primary }]}>{item}</StyledTextMedium>
                    </Pressable>
                )
            }
            }
            keyExtractor={(item) => item.toString()}
        />
    )

    const renderOptionStyle = (value: SequenceType): StyleProp<any> => {
        switch (value) {
            case SequenceType.daily:
                return [styles.option, sequence.type === SequenceType.daily && styles.optionActive,]
            case SequenceType.weekly:
                return [styles.option, sequence.type === SequenceType.weekly && styles.optionActive]
            case SequenceType.monthly:
                return [styles.option, sequence.type === SequenceType.monthly && styles.optionActive]
            default:
                return styles.option
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <StyledTextBold style={styles.questionText}>How Frequent Do You Want To Do This Habit?</StyledTextBold>
            </View>
            <View style={styles.optionsContainer}>
                <Pressable style={() => renderOptionStyle(SequenceType.daily)} onPress={() => setSequence({ type: SequenceType.daily, value: [] })}>
                    <StyledTextBold style={[styles.optionText, { color: sequence.type === SequenceType.daily ? Colors.white : Colors.primary }]}>Daily</StyledTextBold>
                </Pressable>
                <Pressable style={() => renderOptionStyle(SequenceType.weekly)} onPress={() => setSequence({ type: SequenceType.weekly, value: [] })}>
                    <StyledTextBold style={[styles.optionText, { color: sequence.type === SequenceType.weekly ? Colors.white : Colors.primary }]}>Weekly</StyledTextBold>
                </Pressable>
                <Pressable style={() => renderOptionStyle(SequenceType.monthly)} onPress={() => setSequence({ type: SequenceType.monthly, value: [] })}>
                    <StyledTextBold style={[styles.optionText, { color: sequence.type === SequenceType.monthly ? Colors.white : Colors.primary }]}>Monthly</StyledTextBold>
                </Pressable>
            </View>
            <View style={styles.optionValuesContainer}>
                {
                    sequence.type === SequenceType.weekly && renderWeekly()
                }
                {
                    sequence.type === SequenceType.monthly && renderMonthly()
                }
            </View>
            <View style={styles.buttonContainer}>
                <StyledSecondaryButton text='Previous' style={{ flex: .4 }} onPress={handlePreviousStep} />
                <StyledPrimaryButton text='Next' style={{ flex: .4 }} onPress={onNextPress} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.contentBg,
        padding: normalizeWidth(15),
        borderRadius: 20,
        height: normalizeHeight(2),
        justifyContent: 'space-between'
    },
    weekContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1
    },
    monthlyContainer: {
        flex: 1,
        width: '60%'
    },
    optionValuesContainer: {
        flex: 1,
        alignItems: 'center'
    },
    monthly: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20,
    },
    monthlyActive: {
        backgroundColor: Colors.secondary
    },
    monthlyText: {
        fontSize: normalizeWidth(30),
        alignSelf: 'center',
    },
    weekDayText: {
        fontSize: normalizeWidth(30)
    },
    weekDay: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20,
        margin: 5,
        alignItems: 'center'
    },
    weekDayActive: {
        backgroundColor: Colors.secondary
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin: 20,
        marginTop: 10
    },
    optionText: {
        fontSize: 16,
        color: Colors.primary
    },
    option: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20,
    },
    optionActive: {
        backgroundColor: Colors.primary,
    },
    questionText: {
        textTransform: 'capitalize',
        fontSize: normalizeWidth(15),
        color: Colors.primary
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
})
