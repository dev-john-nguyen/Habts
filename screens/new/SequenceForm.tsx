import React from 'react';
import { View, StyleSheet, Pressable, StyleProp } from 'react-native';
import { AsapText, LatoText } from '../../components/StyledText';
import { SequenceType, SequenceProps, WeekDay } from '../../services/habits/types';
import { StyledSecondaryButton, StyledPrimaryButton } from '../../components/StyledButton';
import { BannerActionsProps } from '../../services/banner/types';
import Colors from '../../constants/Colors';
import { FlatList } from 'react-native-gesture-handler';

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

    const renderWeekly = () => (
        <View style={styles.weekContainer}>
            <Pressable onPress={() => handleValueChange(0)} style={() => renderDayStyles(0)}>
                <AsapText style={styles.weekDayText}>Sunday</AsapText>
            </Pressable>
            <Pressable onPress={() => handleValueChange(1)} style={() => renderDayStyles(1)}>
                <AsapText style={styles.weekDayText}>Monday</AsapText>
            </Pressable>
            <Pressable onPress={() => handleValueChange(2)} style={() => renderDayStyles(2)}>
                <AsapText style={styles.weekDayText}>Tuesday</AsapText>
            </Pressable>
            <Pressable onPress={() => handleValueChange(3)} style={() => renderDayStyles(3)}>
                <AsapText style={styles.weekDayText}>Wednesday</AsapText>
            </Pressable>
            <Pressable onPress={() => handleValueChange(4)} style={() => renderDayStyles(4)}>
                <AsapText style={styles.weekDayText}>Thursday</AsapText>
            </Pressable>
            <Pressable onPress={() => handleValueChange(5)} style={() => renderDayStyles(5)}>
                <AsapText style={styles.weekDayText}>Friday</AsapText>
            </Pressable>
            <Pressable onPress={() => handleValueChange(6)} style={() => renderDayStyles(6)}>
                <AsapText style={styles.weekDayText}>Saturday</AsapText>
            </Pressable>
        </View>
    )

    const renderMonthly = () => (
        <View>
            <FlatList
                data={numberArray}
                style={styles.monthlyContainer}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => handleValueChange(item)}
                        style={[styles.monthly, sequence.value.find(day => day == item) ? styles.monthlyActive : undefined]}
                    >
                        <AsapText style={styles.monthlyText}>{item}</AsapText>
                    </Pressable>
                )}
                keyExtractor={(item) => item.toString()}
            />
        </View>
    )

    const renderOptionStyle = (value: SequenceType): StyleProp<any> => {
        switch (value) {
            case SequenceType.daily:
                return [styles.option, sequence.type === SequenceType.daily && styles.optionActive]
            case SequenceType.weekly:
                return [styles.option, sequence.type === SequenceType.weekly && styles.optionActive]
            case SequenceType.monthly:
                return [styles.option, sequence.type === SequenceType.monthly && styles.optionActive]
            default:
                return styles.option
        }
    }

    return (
        <View style={styles.step}>
            <AsapText style={styles.questionText}>How Frequent Do You Want To Do This Habit?</AsapText>
            <LatoText style={styles.infoText}>Daily, Weekly, or Monthly?</LatoText>
            <View style={styles.optionsContainer}>
                <Pressable style={() => renderOptionStyle(SequenceType.daily)} onPress={() => setSequence({ type: SequenceType.daily, value: [] })}>
                    <AsapText style={styles.optionText}>Daily</AsapText>
                </Pressable>
                <Pressable style={() => renderOptionStyle(SequenceType.weekly)} onPress={() => setSequence({ type: SequenceType.weekly, value: [] })}>
                    <AsapText style={styles.optionText}>Weekly</AsapText>
                </Pressable>
                <Pressable style={() => renderOptionStyle(SequenceType.monthly)} onPress={() => setSequence({ type: SequenceType.monthly, value: [] })}>
                    <AsapText style={styles.optionText}>Monthly</AsapText>
                </Pressable>
            </View>
            {
                sequence.type === SequenceType.weekly && renderWeekly()
            }
            {
                sequence.type === SequenceType.monthly && renderMonthly()
            }
            <View style={styles.buttonContainer}>
                <StyledSecondaryButton text='Previous' style={{ flex: .4 }} onPress={handlePreviousStep} />
                <StyledPrimaryButton text='Next' style={{ flex: .4 }} onPress={onNextPress} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    step: {
        marginTop: 10,
        width: '100%'
    },
    weekContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    monthlyContainer: {
        height: 100,
        width: 200,
        alignSelf: 'center'
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
        fontSize: 16,
        alignSelf: 'center',
        color: Colors.white
    },
    weekDayText: {
        fontSize: 14,
        color: Colors.white
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
        marginTop: 30
    },
    optionText: {
        fontSize: 16,
        color: Colors.white
    },
    option: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20,
    },
    optionActive: {
        backgroundColor: Colors.primary
    },
    questionText: {
        textTransform: 'capitalize',
        fontSize: 30,
        color: Colors.white
    },
    infoText: {
        margin: 5,
        marginLeft: 10,
        fontSize: 12,
        color: Colors.white,
        fontStyle: 'italic'
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 50
    }
})
