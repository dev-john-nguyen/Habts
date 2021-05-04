import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ActivityIndicator, Pressable, Keyboard, Animated, SafeAreaView } from 'react-native';
import { AsapText, LatoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import { StyledPrimaryButton, StyledSecondaryButton, StyledDisabledButton } from '../components/StyledButton';
import { StyledTextInput } from '../components/StyledTextInput';
import HabitHeader from '../components/HabitHeader';
import { NewHabitProps, HabitsActionsProps, HabitProps, Time, TimeDataProps, SequenceProps, SequenceType } from '../services/habits/types';
import { addHabit } from '../services/habits/actions';
import { RootStackParamList } from '../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { setBanner } from '../services/banner/actions';
import { BannerActionsProps } from '../services/banner/types';
import { ReducerStateProps } from '../services';
import { isInvalidTime } from '../utils/tools';
import { emptyHabitEdit, emptyHabitExtra, charLimitHabitName, charLimitLocation, charLimitNotes, charCue } from './utils';
import SequenceForm from './new/SequenceForm';
import TimeForm from './new/TimeForm';
import ProgressRunner from './new/ProgressRunner';
import BottomSvg from '../assets/svgs/bottom';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import NotificationForm from './new/NotificationForm';

type NewScreenNavProp = StackNavigationProp<RootStackParamList, 'New'>

interface NewProps {
    addHabit: HabitsActionsProps['addHabit'];
    navigation: NewScreenNavProp;
    setBanner: BannerActionsProps['setBanner'];
    habits: HabitProps[]
}

const New = ({ addHabit, navigation, setBanner, habits }: NewProps) => {
    const dateNow = new Date()
    const [step, setStep] = useState(0);
    const [startTime, setStartTime] = useState<Date>(new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 9, 0));
    const [endTime, setEndTime] = useState<Date>(new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 9, 30));
    const [notificationNum, setNotificationNum] = useState<number>(0);
    const [notificationOn, setNotificationOn] = useState<boolean>(true);
    const [cue, setCue] = useState<string>('');
    const [sequence, setSequence] = useState<SequenceProps>({ type: SequenceType.daily, value: [] })
    const [locationDes, setLocationDes] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [remove, setRemove] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const keyboardRef: any = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', (key) => {
            Animated.spring(keyboardRef, {
                useNativeDriver: false,
                toValue: key.endCoordinates.height / 2
            }).start()
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
            Animated.spring(keyboardRef, {
                useNativeDriver: false,
                toValue: 0
            }).start()
        });

        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    }, [])

    const handleRemoveOldHabit = (ans: boolean) => {
        if (ans) {
            handleNextStep()
        } else {
            setStep(3)
        }
    }

    const handleNextStep = () => {
        if (step == 5) {
            const startTimeObj: Time = {
                date: startTime,
                hour: startTime.getHours(),
                minute: startTime.getMinutes()
            }

            const endTimeObj: Time = {
                date: endTime,
                hour: endTime.getHours(),
                minute: endTime.getMinutes()
            }
            const preparedData: TimeDataProps = {
                docId: '',
                startTime: startTimeObj,
                endTime: endTimeObj
            }
            const { type, message } = isInvalidTime(preparedData, habits);
            if (type == 'error') return setBanner("error", message)

            if (type == 'warning') setBanner('warning', message)
        }
        setStep(step + 1)
    }

    const handlePreviousStep = () => {
        if (step < 4) {
            setStep(0)
        } else {
            setStep(step - 1)
        }
    }

    const handleSave = () => {

        const startTimeObj: Time = {
            date: startTime,
            hour: startTime.getHours(),
            minute: startTime.getMinutes()
        }

        const endTimeObj: Time = {
            date: endTime,
            hour: endTime.getHours(),
            minute: endTime.getMinutes()
        }

        const newHabit: NewHabitProps = {
            startTime: startTimeObj,
            endTime: endTimeObj,
            cue,
            locationDes,
            notes,
            remove,
            name,
            notificationOn: notificationOn,
            notificationTime: genNotificationTime(),
            sequence
        }

        setLoading(true)
        setStep(10)

        addHabit(newHabit)
            .then((res) => {
                setLoading(false)
                if (res) navigation.navigate("Home")
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    const genNotificationTime = (): Time & { totalMins: number } => {
        const notificationDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), startTime.getHours(), startTime.getMinutes() - notificationNum);

        return {
            date: notificationDate,
            hour: notificationDate.getHours(),
            minute: notificationDate.getMinutes(),
            totalMins: notificationNum
        }
    }

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <View style={styles.step}>
                        <AsapText style={styles.questionText}>Removing An Old Habit?</AsapText>
                        <View style={styles.buttonContainer}>
                            <StyledPrimaryButton text='Yes' style={{ flex: .4 }} onPress={() => handleRemoveOldHabit(true)} />
                            <StyledSecondaryButton text='No' style={{ flex: .4 }} onPress={() => handleRemoveOldHabit(false)} />
                        </View>
                    </View>
                )
            case 1:
                return (
                    <Pressable style={styles.step} onPress={Keyboard.dismiss}>
                        <LatoText style={styles.infoText}>in a few words or less.</LatoText>
                        <AsapText style={styles.questionText}>What Habit Do You Want To Remove From Your Life?</AsapText>
                        <StyledTextInput
                            value={remove}
                            style={styles.responseInput}
                            placeholder="Junk Food"
                            autoCorrect={true}
                            multiline={false}
                            maxLength={charLimitHabitName}
                            blurOnSubmit={true}
                            onChangeText={(text) => setRemove(text)} />
                        <View style={styles.buttonContainer}>
                            <StyledSecondaryButton text='Previous' style={{ flex: .4 }} onPress={handlePreviousStep} />
                            {
                                !remove ?
                                    <StyledDisabledButton text='Next' style={{ flex: .4 }} />
                                    : <StyledPrimaryButton text='Next' style={{ flex: .4 }} onPress={handleNextStep} />
                            }
                        </View>
                    </Pressable>
                )
            case 2:
                return (
                    <View style={styles.step}>
                        <AsapText style={styles.questionText}>We Recommend Replacing The Old Habit With A New One.</AsapText>
                        <View style={styles.buttonContainer}>
                            <StyledSecondaryButton text='Previous' style={{ flex: .4 }} onPress={handlePreviousStep} />
                            <StyledPrimaryButton text='Next' style={{ flex: .4 }} onPress={handleNextStep} />
                        </View>
                    </View>
                )
            case 3:
                return (
                    <Pressable style={styles.step} onPress={Keyboard.dismiss}>
                        <LatoText style={styles.infoText}>in a few words or less.</LatoText>
                        <AsapText style={styles.questionText}>What Habit Do You Want To Implement Into Your Life?</AsapText>
                        <StyledTextInput
                            value={name}
                            style={styles.responseInput}
                            placeholder="Meditation"
                            autoCorrect={true}
                            multiline={false}
                            maxLength={charLimitHabitName}
                            blurOnSubmit={true}
                            onChangeText={(text) => setName(text)}
                        />
                        <View style={styles.buttonContainer}>
                            <StyledSecondaryButton text='Previous' style={{ flex: .4 }} onPress={handlePreviousStep} />
                            {
                                !name ?
                                    <StyledDisabledButton text='Next' style={{ flex: .4 }} />
                                    : <StyledPrimaryButton text='Next' style={{ flex: .4 }} onPress={handleNextStep} />
                            }
                        </View>
                    </Pressable>
                )
            case 4:
                return <SequenceForm
                    sequence={sequence}
                    setSequence={setSequence}
                    handleNextStep={handleNextStep}
                    handlePreviousStep={handlePreviousStep}
                    setBanner={setBanner}
                />
            case 5:
                return <TimeForm
                    startTime={startTime}
                    endTime={endTime}
                    setStartTime={setStartTime}
                    setEndTime={setEndTime}
                    handleNextStep={handleNextStep}
                    handlePreviousStep={handlePreviousStep}
                    habits={habits}
                />
            case 6:
                return (
                    <Pressable style={styles.step} onPress={Keyboard.dismiss}>
                        <LatoText style={styles.infoText}>In a few words or less.</LatoText>
                        <AsapText style={styles.questionText}>Where Will You Be?</AsapText>
                        <StyledTextInput
                            value={locationDes}
                            style={styles.responseInput}
                            placeholder="Home - Living Room"
                            autoCorrect={true}
                            multiline={true}
                            maxLength={charLimitLocation}
                            blurOnSubmit={true}
                            onChangeText={(text) => setLocationDes(text)}
                        />
                        <View style={styles.buttonContainer}>
                            <StyledSecondaryButton text='Previous' style={{ flex: .4 }} onPress={handlePreviousStep} />
                            {
                                !locationDes ?
                                    <StyledDisabledButton text='Next' style={{ flex: .4 }} />
                                    : <StyledPrimaryButton text='Next' style={{ flex: .4 }} onPress={handleNextStep} />
                            }
                        </View>
                    </Pressable>
                )
            case 7:
                return (
                    <Pressable style={styles.step} onPress={Keyboard.dismiss}>
                        <AsapText style={styles.questionText}>What Cue Do You Want To Trigger The Habit?</AsapText>
                        <LatoText style={styles.infoText}>Something that you will do before you start the habit. Example, “I will meditate after I drink my morning coffee.” The habit is meditating and the cue is drinking the morning coffee. Also, this will be your notification text!</LatoText>
                        <StyledTextInput
                            value={cue}
                            style={styles.responseInput}
                            placeholder="I will meditate after I drink my morning coffee"
                            blurOnSubmit={true}
                            autoCorrect={true}
                            multiline={true}
                            maxLength={charCue}
                            onChangeText={(text) => setCue(text)}
                        />
                        <View style={styles.buttonContainer}>
                            <StyledSecondaryButton text='Previous' style={{ flex: .4 }} onPress={handlePreviousStep} />
                            {
                                !cue ?
                                    <StyledDisabledButton text='Next' style={{ flex: .4 }} />
                                    : <StyledPrimaryButton text='Next' style={{ flex: .4 }} onPress={handleNextStep} />
                            }
                        </View>
                    </Pressable>
                )
            case 8:
                return <NotificationForm
                    notificationNum={notificationNum}
                    setNotificationNum={setNotificationNum}
                    notificationOn={notificationOn}
                    setNotificationOn={setNotificationOn}
                    handlePreviousStep={handlePreviousStep}
                    handleNextStep={handleNextStep}

                />
            case 9:
                return (
                    <Pressable style={styles.step} onPress={Keyboard.dismiss}>
                        <AsapText style={styles.questionText}>Any Personal Notes You Want To Add?</AsapText>
                        <LatoText style={styles.infoText}>Maybe include the reason WHY you want to implement this habit into your life.</LatoText>
                        <StyledTextInput
                            value={notes}
                            style={[styles.responseInput, { minHeight: 200 }]}
                            placeholder="I want to decrease my stress and anxiety, and at the same time increase my self-awareness."
                            autoCorrect={true}
                            multiline={true}
                            maxLength={charLimitNotes}
                            onChangeText={(text) => setNotes(text)}
                        />
                        <View style={styles.buttonContainer}>
                            <StyledSecondaryButton text='Previous' style={{ flex: .4 }} onPress={handlePreviousStep} />
                            <StyledPrimaryButton text='Next' style={{ flex: .4 }} onPress={handleNextStep} />
                        </View>
                    </Pressable>
                )
            default:
                return (
                    <View style={styles.step}>
                        <LatoText style={[styles.infoText, { alignSelf: 'center' }]}>Overview</LatoText>
                        <HabitHeader
                            setHabitEdit={() => undefined}
                            habitEdit={emptyHabitEdit}
                            edit={false}
                            habit={{
                                startTime: {
                                    date: startTime,
                                    hour: startTime.getHours(),
                                    minute: startTime.getMinutes()
                                },
                                endTime: {
                                    date: endTime,
                                    hour: endTime.getHours(),
                                    minute: endTime.getMinutes()
                                },
                                cue,
                                locationDes,
                                notes,
                                remove,
                                name,
                                sequence,
                                notificationTime: genNotificationTime(),
                                notificationOn,
                                ...emptyHabitExtra
                            }}
                        />
                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', zIndex: 100 }}>
                            <StyledSecondaryButton text='Previous' style={{ flex: .4 }} onPress={handlePreviousStep} />
                            <StyledPrimaryButton text={loading ? <ActivityIndicator color={Colors.white} /> : 'Save'} style={{ flex: .4, zIndex: 100 }} onPress={handleSave} />
                        </View>
                    </View>
                )
        }
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    {renderStep()}
                    <Animated.View style={{ height: keyboardRef }} />
                </View>
            </SafeAreaView>
            <View style={styles.bottomSvg}>
                <BottomSvg />
            </View>
            <ProgressRunner step={step} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 40,
        paddingRight: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomSvg: {
        position: 'absolute',
        width: '100%',
        height: normalizeHeight(19),
        bottom: 0
    },
    step: {
        flex: 1,
        marginTop: 10,
        justifyContent: 'center',
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
    responseInput: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.primary,
        fontSize: normalizeWidth(25),
        padding: 10,
        paddingTop: 10,
        color: Colors.white,
        marginTop: 50
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 50
    }
})

const mapStateToProps = (state: ReducerStateProps) => ({
    habits: state.habits.habits
})

export default connect(mapStateToProps, { addHabit, setBanner })(New);

