import React, { useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, FlatList } from 'react-native';
import Colors from '../../constants/Colors';
import { StyledPrimaryButton, StyledDisabledButton, StyledSecondaryButton } from '../../components/StyledButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LatoText, AsapText } from '../../components/StyledText';
import { Entypo } from '@expo/vector-icons';
import { formatTime, renderSequenceValue } from '../../utils/tools';
import { HabitProps } from '../../services/habits/types';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';

interface Props {
    habits: HabitProps[];
    startTime: Date;
    endTime: Date;
    setStartTime: (d: Date) => void;
    setEndTime: (d: Date) => void;
    handlePreviousStep: () => void;
    handleNextStep: () => void;
}

export default ({ habits, startTime, endTime, setStartTime, setEndTime, handlePreviousStep, handleNextStep }: Props) => {
    const [timeStep, setTimeStep] = useState(0);
    const habitListHeight: any = useRef(new Animated.Value(0)).current;
    const habitListWidth = useRef(new Animated.Value(0)).current;

    const handleHabitList = () => {
        if (habitListHeight._value > 0) {
            Animated.parallel([
                Animated.timing(habitListHeight, {
                    useNativeDriver: false,
                    toValue: 0,
                    easing: Easing.inOut(Easing.circle),
                    duration: 500
                }),
                Animated.timing(habitListWidth, {
                    useNativeDriver: false,
                    toValue: 2,
                    easing: Easing.inOut(Easing.circle),
                    duration: 500
                })
            ]).start(() => habitListWidth.setValue(0))
        } else {
            Animated.parallel([
                Animated.timing(habitListHeight, {
                    useNativeDriver: false,
                    toValue: 100,
                    easing: Easing.inOut(Easing.circle),
                    duration: 500
                }),
                Animated.timing(habitListWidth, {
                    useNativeDriver: false,
                    toValue: 1,
                    easing: Easing.inOut(Easing.circle),
                    duration: 500
                })
            ]).start()
        }
    }

    const handleNext = () => {
        if (timeStep < 1) {
            setTimeStep(1)
        } else if (timeStep > 0) {
            handleNextStep()
        }
    }
    const handlePrevious = () => {
        if (timeStep < 1) {
            handlePreviousStep()
        } else if (timeStep > 0) {
            setTimeStep(0)
        }
    }

    return (
        <View style={styles.step}>
            <LatoText style={styles.infoText}>in 5 minute intervals.</LatoText>
            <AsapText style={styles.questionText}>What Time In The Day Do You Want To Implement This Habit?</AsapText>
            <View style={styles.timeContainer}>
                <Entypo name="list" size={24} color={Colors.white} onPress={handleHabitList} style={{ position: 'absolute', zIndex: 10 }} />
                <Animated.View
                    style={[{
                        height: habitListHeight,
                        width: habitListWidth.interpolate({ inputRange: [0, 1, 2], outputRange: ['0%', '100%', '0%'] }),
                        backgroundColor: Colors.secondary,
                        borderRadius: 10,
                        top: -10
                    }]}
                >
                    <FlatList
                        data={habits}
                        keyExtractor={(item, index) => item.docId}
                        ListEmptyComponent={<AsapText style={styles.habitListText}>No Habits</AsapText>}
                        style={styles.habitContainer}
                        contentContainerStyle={styles.habitList}
                        renderItem={({ item }) => (
                            <View style={styles.habitListContainer}>
                                <AsapText style={styles.habitListText}>{item.name}</AsapText>
                                <AsapText style={styles.habitListText}>{item.sequence.type} {renderSequenceValue(item)}</AsapText>
                                <AsapText style={styles.habitListText}>{formatTime(item.startTime)} - {formatTime(item.endTime)}</AsapText>
                            </View>
                        )}
                    />
                </Animated.View>
                <View style={styles.time}>
                    <AsapText style={styles.timeText}>{timeStep > 0 ? "End Time" : "Start Time"}: </AsapText>
                    <DateTimePicker
                        value={timeStep > 0 ? endTime : startTime}
                        minuteInterval={5}
                        mode='time'
                        is24Hour={true}
                        display="spinner"
                        onChange={(e: any, date: any) => timeStep > 0 ? setEndTime(date) : setStartTime(date)}
                        style={styles.pickerContainer}
                        textColor='white'
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <StyledSecondaryButton text='Previous' style={{ flex: .4 }} onPress={handlePrevious} />
                {
                    !(() => {
                        if (timeStep > 0 && endTime <= startTime) {
                            return false
                        } else {
                            return true
                        }
                    })() ?
                        <StyledDisabledButton text='Next' style={{ flex: .4 }} />
                        : <StyledPrimaryButton text='Next' style={{ flex: .4 }} onPress={handleNext} />
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
    habitContainer: {
        flex: 1
    },
    pickerContainer: {
        flex: 1
    },
    habitListContainer: {
        flexDirection: 'row',
        margin: 5
    },
    habitListText: {
        flex: 1,
        textAlign: 'center',
        color: Colors.white,
        fontSize: normalizeWidth(30),
        margin: 5,
        flexWrap: 'wrap'
    },
    step: {
        marginTop: 20,
        width: '100%',
    },
    timeText: {
        fontSize: normalizeWidth(20),
        marginRight: 20,
        color: Colors.white
    },
    timeContainer: {
        marginTop: normalizeHeight(20),
        paddingTop: normalizeHeight(20),
    },
    time: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        marginTop: 20
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: normalizeHeight(10)
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

