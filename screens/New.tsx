import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ActivityIndicator, Pressable, Keyboard, Animated, SafeAreaView } from 'react-native';
import { StyledText, StyledTextBold } from '../components/StyledText';
import Colors from '../constants/Colors';
import { StyledPrimaryButton, StyledSecondaryButton, StyledDisabledButton } from '../components/StyledButton';
import { StyledTextInput } from '../components/StyledTextInput';
import HabitHeader from '../components/habit/Header';
import { NewHabitProps, HabitsActionsProps, HabitProps, Time, TimeDataProps, SequenceProps, SequenceType } from '../services/habits/types';
import { addHabit } from '../services/habits/actions';
import { RootStackParamList } from '../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { setBanner } from '../services/banner/actions';
import { BannerActionsProps } from '../services/banner/types';
import { ReducerStateProps } from '../services';
import { isInvalidTime } from '../utils/tools';
import { emptyHabitEdit, emptyHabitExtra } from './utils';
import SequenceForm from './new/SequenceForm';
import TimeForm from './new/TimeForm';
import BottomSvg from '../assets/svgs/bottom';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import NotificationForm from './new/NotificationForm';
import Inputs from '../constants/Inputs';
import { DateTime } from 'luxon';
import { dailyGoals, otherGoals } from '../services/habits/utils/variables';

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
    const [notificationOn, setNotificationOn] = useState<boolean>(false);
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
            setStep(2)
        }
    }

    const getTimeDate = () => {
        const luxStartTime = DateTime.fromJSDate(startTime);

        const startTimeObj: Time = {
            date: luxStartTime.toJSDate(),
            zoneName: luxStartTime.zoneName,
            hour: luxStartTime.hour,
            minute: luxStartTime.minute
        }

        const luxEndTime = DateTime.fromJSDate(endTime);

        const endTimeObj: Time = {
            date: luxEndTime.toJSDate(),
            zoneName: luxEndTime.zoneName,
            hour: luxEndTime.hour,
            minute: luxEndTime.minute
        }

        return {
            startTime: startTimeObj,
            endTime: endTimeObj
        }
    }

    const handleNextStep = () => {
        if (step == 4) {

            const timeDate = getTimeDate();

            const preparedData: TimeDataProps = {
                docId: '',
                startTime: timeDate.startTime,
                endTime: timeDate.endTime
            }

            const { type, message } = isInvalidTime(preparedData, habits);
            if (type == 'error') return setBanner("error", message)

            if (type == 'warning') setBanner('warning', message)
        }
        setStep(step + 1)
    }

    const handlePreviousStep = () => {
        if (step < 3) {
            setStep(0)
        } else {
            setStep(step - 1)
        }
    }

    const handleSave = () => {

        const timeDate = getTimeDate();

        const newHabit: NewHabitProps = {
            startTime: timeDate.startTime,
            endTime: timeDate.endTime,
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
            totalMins: notificationNum,
            zoneName: DateTime.now().zoneName
        }
    }

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <View style={styles.content}>
                        <StyledTextBold style={styles.questionText}>Removing An Old Habit?</StyledTextBold>
                        <StyledText style={styles.infoText} />
                        <View style={styles.buttonContainer}>
                            <StyledPrimaryButton text='Yes' style={{ flex: .4 }} onPress={() => handleRemoveOldHabit(true)} />
                            <StyledSecondaryButton text='No' style={{ flex: .4 }} onPress={() => handleRemoveOldHabit(false)} />
                        </View>
                    </View>
                )
            case 1:
                return (
                    <Pressable style={styles.content} onPress={Keyboard.dismiss}>
                        <StyledTextBold style={styles.questionText}>What Habit Do You Want To Remove From Your Life?</StyledTextBold>
                        <StyledText style={styles.infoText} />
                        <StyledTextInput
                            value={remove}
                            style={styles.responseInput}
                            placeholder="Junk Food"
                            autoCorrect={true}
                            multiline={false}
                            maxLength={Inputs.habitNameMaxChar}
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
                    <Pressable style={styles.content} onPress={Keyboard.dismiss}>
                        <StyledTextBold style={styles.questionText}>What Habit Do You Want To Implement Into Your Life?</StyledTextBold>
                        <StyledText style={styles.infoText} />
                        <StyledTextInput
                            value={name}
                            style={styles.responseInput}
                            placeholder="Meditation"
                            placeholderTextColor={Colors.grey}
                            autoCorrect={true}
                            multiline={false}
                            maxLength={Inputs.habitNameMaxChar}
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
            case 3:
                return <SequenceForm
                    sequence={sequence}
                    setSequence={setSequence}
                    handleNextStep={handleNextStep}
                    handlePreviousStep={handlePreviousStep}
                    setBanner={setBanner}
                />
            case 4:
                return <TimeForm
                    startTime={startTime}
                    endTime={endTime}
                    setStartTime={setStartTime}
                    setEndTime={setEndTime}
                    handleNextStep={handleNextStep}
                    handlePreviousStep={handlePreviousStep}
                    habits={habits}
                />
            case 5:
                return (
                    <Pressable style={styles.content} onPress={Keyboard.dismiss}>
                        <View>
                            <StyledTextBold style={styles.questionText}>Location of which the habit will be performed</StyledTextBold>
                            <StyledText style={styles.infoText}>Ex. Home - Living Room</StyledText>

                        </View>

                        <StyledTextInput
                            value={locationDes}
                            style={styles.responseInput}
                            placeholder="Home - Living Room"
                            placeholderTextColor={Colors.grey}
                            autoCorrect={true}
                            multiline={true}
                            maxLength={Inputs.habitLocationMaxChar}
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
            case 6:
                return (
                    <Pressable style={styles.content} onPress={Keyboard.dismiss}>
                        <View>
                            <StyledTextBold style={styles.questionText}>What Cue Do You Want To Trigger The Habit?</StyledTextBold>
                            <StyledText style={styles.infoText}>Ex. “I will meditate after I drink my morning coffee.”</StyledText>
                        </View>

                        <StyledTextInput
                            value={cue}
                            style={styles.responseInput}
                            placeholder="I will meditate after I drink my morning coffee"
                            placeholderTextColor={Colors.grey}
                            blurOnSubmit={true}
                            autoCorrect={true}
                            multiline={true}
                            maxLength={Inputs.habitCueMaxChar}
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
            case 7:
                return <NotificationForm
                    notificationNum={notificationNum}
                    setNotificationNum={setNotificationNum}
                    notificationOn={notificationOn}
                    setNotificationOn={setNotificationOn}
                    handlePreviousStep={handlePreviousStep}
                    handleNextStep={handleNextStep}

                />
            case 8:
                return (
                    <Pressable style={styles.content} onPress={Keyboard.dismiss}>

                        <View>
                            <StyledTextBold style={styles.questionText}>Any Personal Notes You Want To Add?</StyledTextBold>
                            <StyledText style={styles.infoText}>Maybe include the reason WHY you want to implement this habit into your life.</StyledText>
                        </View>

                        <StyledTextInput
                            value={notes}
                            style={[styles.responseInput, { maxHeight: normalizeHeight(5) }]}
                            placeholder="Ex. Meditating daily will help decrease my stress and improve my focus."
                            placeholderTextColor={Colors.grey}
                            autoCorrect={true}
                            multiline={true}
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
                    <View style={styles.content}>
                        <View style={{ marginBottom: normalizeHeight(20) }}>
                            <HabitHeader
                                newCom={true}
                                setHabitEdit={() => undefined}
                                habitEdit={emptyHabitEdit}
                                edit={false}
                                habit={{
                                    startTime: {
                                        date: startTime,
                                        hour: startTime.getHours(),
                                        minute: startTime.getMinutes(),
                                        zoneName: DateTime.now().zoneName
                                    },
                                    endTime: {
                                        date: endTime,
                                        hour: endTime.getHours(),
                                        minute: endTime.getMinutes(),
                                        zoneName: DateTime.now().zoneName
                                    },
                                    cue,
                                    locationDes,
                                    notes,
                                    remove,
                                    name,
                                    sequence,
                                    notificationTime: genNotificationTime(),
                                    notificationOn,
                                    consecutive: sequence.type === SequenceType.daily ? dailyGoals() : otherGoals(sequence.value.length),
                                    ...emptyHabitExtra
                                }}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <StyledSecondaryButton text='Previous' style={{ flex: .4 }} onPress={handlePreviousStep} />
                            <StyledPrimaryButton text={loading ? <ActivityIndicator color={Colors.primary} /> : 'Save'} style={{ flex: .4, zIndex: 100 }} onPress={handleSave} />
                        </View>
                    </View>
                )
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {renderStep()}
                <Animated.View style={{ height: keyboardRef }} />
            </View>
            <View style={styles.bottomSvg}>
                <BottomSvg />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: normalizeWidth(15),
        paddingTop: normalizeHeight(25),
    },
    finalPreview: {
        flex: 1
    },
    content: {
        backgroundColor: Colors.contentBg,
        padding: normalizeWidth(15),
        borderRadius: 10,
        justifyContent: 'space-between'
    },
    bottomSvg: {
        position: 'absolute',
        width: '100%',
        height: normalizeHeight(19),
        bottom: 0
    },
    questionText: {
        textTransform: 'capitalize',
        fontSize: normalizeWidth(15),
        color: Colors.primary
    },
    infoText: {
        fontSize: normalizeWidth(30),
        color: Colors.primary,
        marginTop: 5,
        marginBottom: 10
    },
    responseInput: {
        borderRadius: 5,
        fontSize: normalizeWidth(25),
        padding: 10,
        paddingTop: 10,
        color: Colors.primary,
        backgroundColor: Colors.white,
        marginBottom: normalizeHeight(20)
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    overviewBtns: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        zIndex: 100,
        marginTop: normalizeHeight(10)
    },
    overviewContainer: {
        justifyContent: 'center',
        flex: 1,
    }
})

const mapStateToProps = (state: ReducerStateProps) => ({
    habits: state.habits.habits
})

export default connect(mapStateToProps, { addHabit, setBanner })(New);

