import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'
import { AsapText, AsapTextBold, AsapTextMedium } from '../StyledText';
import Colors from '../../constants/Colors';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HabitProps, HabitEditProps, CompletedHabitsProps } from '../../services/habits/types';
import { StyledTextInput } from '../StyledTextInput';
import { formatTime, renderSequenceValue } from '../../utils/tools';
import { ScrollView } from 'react-native-gesture-handler';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import { Picker } from '@react-native-picker/picker';
import { arrayOfNums } from '../../screens/utils';
import HabitBadges from '../badges/HabitBadges';
import Inputs from '../../constants/Inputs';
import { DateTime } from 'luxon';
import Notes from './Notes';

interface HabitHeader {
    habit: HabitProps;
    edit: boolean;
    setHabitEdit: (habit: HabitEditProps) => void;
    habitEdit: HabitEditProps;
    setShowNotes?: (show: boolean) => void;
    showNotes?: boolean;
    newCom?: boolean;
}


export default ({ habit, newCom, edit, setHabitEdit, habitEdit }: HabitHeader) => {
    const [showNotes, setShowNotes] = useState(false);


    const luxNow = DateTime.now();

    const renderNotificationEdit = () => {
        if (edit) {
            return <Picker
                selectedValue={habitEdit.notificationTime.totalMins}
                onValueChange={(itemValue: any, itemIndex: number) => setHabitEdit({ ...habitEdit, notificationTime: { ...habitEdit.notificationTime, totalMins: parseInt(itemValue) } })}
                itemStyle={styles.pickerItemStyle}
            >
                {arrayOfNums(61).map((item) => (
                    <Picker.Item label={item.toString()} value={item} key={item.toString()} />
                ))}
            </Picker>
        } else {
            return <AsapText style={styles.totalMinsText}>{habit.notificationTime.totalMins ? habit.notificationTime.totalMins : '0'}</AsapText>
        }
    }

    const calcConsecutiveTotal = () => {
        let consecutiveTotal: CompletedHabitsProps[] = [];

        Object.keys(habit.consecutive).forEach((goalKey, i) => {
            const { count } = habit.consecutive[goalKey];
            if (count.length > 0) {
                consecutiveTotal = consecutiveTotal.concat(count)
            }
        })

        return consecutiveTotal.length
    }

    const onShowNotes = () => setShowNotes && setShowNotes(showNotes ? false : true);

    const onUpdateNotes = (text: string) => habitEdit && setHabitEdit({ ...habitEdit, notes: text });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <AsapText style={styles.headerSubText}>{habit.remove}</AsapText>
                    <AsapTextBold style={styles.headerText}>{habit.name}</AsapTextBold>
                </View>
            </View>
            {showNotes ?
                <Notes
                    notes={habit.notes}
                    onClose={onShowNotes}
                    edit={edit}
                    editNotes={habitEdit.notes}
                    updateNotes={onUpdateNotes}
                />
                :
                <View>
                    <View>
                        <View style={styles.dataItem}>
                            {edit ?
                                <View style={styles.timeContainer}>
                                    <View style={styles.time}>
                                        <AsapTextMedium style={styles.timeText}>Start Time: </AsapTextMedium>
                                        <DateTimePicker
                                            value={habitEdit.startTime.date}
                                            minuteInterval={5}
                                            mode='time'
                                            is24Hour={true}
                                            display="default"
                                            onChange={(e: any, date: any) => setHabitEdit({ ...habitEdit, startTime: { date: new Date(date), hour: date.getHours(), minute: date.getMinutes(), zoneName: luxNow.zoneName } })}
                                            style={styles.datePicker}
                                        />
                                    </View>
                                    <View style={styles.time}>
                                        <AsapTextMedium style={styles.timeText}>End Time: </AsapTextMedium>
                                        <DateTimePicker
                                            value={habitEdit.endTime.date}
                                            minuteInterval={5}
                                            mode='time'
                                            is24Hour={true}
                                            display="default"
                                            onChange={(e: any, date: any) => setHabitEdit({ ...habitEdit, endTime: { date: new Date(date), hour: date.getHours(), minute: date.getMinutes(), zoneName: luxNow.zoneName } })}
                                            style={styles.datePicker}
                                            children
                                        />
                                    </View>
                                </View>
                                : <>
                                    <AsapTextMedium style={styles.dataText}>{formatTime(habit.startTime)} - {formatTime(habit.endTime)} ({habit.sequence.type}{renderSequenceValue(habit)}) </AsapTextMedium>
                                    {
                                        edit ?
                                            habitEdit.notificationOn
                                                ? <Entypo name="bell" size={normalizeHeight(50)} color={Colors.secondary} style={styles.bell} onPress={() => edit && setHabitEdit({ ...habitEdit, notificationOn: false })} />
                                                : <Entypo name="sound-mute" size={normalizeHeight(50)} color={Colors.secondary} style={styles.bell} onPress={() => edit && setHabitEdit({ ...habitEdit, notificationOn: true })} />
                                            : habit.notificationOn ? <Entypo name="bell" size={normalizeHeight(50)} color={Colors.secondary} style={styles.bell} onPress={() => edit && setHabitEdit({ ...habitEdit, notificationOn: false })} />
                                                : <Entypo name="sound-mute" size={normalizeHeight(50)} color={Colors.secondary} style={styles.bell} onPress={() => edit && setHabitEdit({ ...habitEdit, notificationOn: true })} />
                                    }
                                </>
                            }
                        </View>

                        <View style={styles.dataItem}>
                            {
                                edit ?
                                    <StyledTextInput
                                        style={styles.textInput}
                                        value={habitEdit.locationDes}
                                        onChangeText={(text) => setHabitEdit({ ...habitEdit, locationDes: text })}
                                        autoCorrect={true}
                                        multiline={true}
                                        maxLength={Inputs.habitLocationMaxChar}
                                    />
                                    : <AsapTextMedium style={styles.dataText}>{habit.locationDes}</AsapTextMedium>
                            }
                        </View>

                        <View style={styles.dataItem}>
                            {
                                edit ?
                                    <StyledTextInput
                                        style={styles.textInput}
                                        value={habitEdit.cue}
                                        onChangeText={(text) => setHabitEdit({ ...habitEdit, cue: text })}
                                        autoCorrect={true}
                                        multiline={true}
                                        maxLength={Inputs.habitCueMaxChar}
                                    />
                                    : <AsapTextMedium style={styles.dataText}>{habit.cue}</AsapTextMedium>
                            }
                        </View>

                    </View>


                    <View style={{ marginTop: 10 }}>

                        <View style={styles.dataItem}>
                            <Entypo name="bar-graph" size={normalizeHeight(40)} color={Colors.secondary} style={{ marginRight: 2 }} />
                            <AsapTextMedium style={styles.dataText}>{calcConsecutiveTotal()} day(s) in a row</AsapTextMedium>
                        </View>

                        <View style={styles.dataItem}>
                            <Entypo name="text-document" size={normalizeHeight(35)} color={Colors.secondary} onPress={onShowNotes} style={{ marginRight: 2 }} />
                            {
                                edit ?
                                    <StyledTextInput
                                        style={styles.textInput}
                                        value={habitEdit.notes}
                                        onChangeText={(text) => setHabitEdit({ ...habitEdit, notes: text })}
                                        autoCorrect={true}
                                        multiline={true}
                                        maxLength={Inputs.habitNotesMaxChar}
                                    />
                                    : <ScrollView style={{ maxHeight: normalizeHeight(20) }}>
                                        <AsapText style={styles.dataText}>{habit.notes}</AsapText>
                                    </ScrollView>
                            }
                        </View>
                    </View>
                </View>
            }

            <HabitBadges consecutive={habit.consecutive} size={normalizeHeight(25)} infoText="Earn your first badge by completing 21 consecutive days." />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    },
    header: {
    },
    pickerItemStyle: {
        fontSize: normalizeHeight(60),
        color: Colors.primary,
        padding: normalizeWidth(10),
        height: normalizeHeight(30),
        borderRadius: 10
    },
    timeText: {
        fontSize: normalizeHeight(60),
        color: Colors.primary
    },
    timeContainer: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 20
    },
    datePicker: {
        fontSize: normalizeHeight(60),
        width: 100,
        height: '100%',
    },
    time: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center'
    },
    textInput: {
        fontSize: normalizeHeight(60),
        color: Colors.primary,
        marginLeft: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.primary,
        padding: 10,
        paddingTop: 10,
        flex: 1,
        maxHeight: 100,
        backgroundColor: Colors.secondary
    },
    bell: {

    },
    headerText: {
        fontSize: normalizeHeight(20),
        color: Colors.primary,
        textTransform: 'capitalize'
    },
    headerSubText: {
        fontSize: normalizeHeight(70),
        color: Colors.primary,
        textDecorationLine: 'line-through',
        alignSelf: 'flex-end'
    },
    data: {
        marginTop: 10,
        marginBottom: 20
    },
    dataItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        flexWrap: 'wrap'
    },
    dataText: {
        fontSize: normalizeHeight(60),
        color: Colors.primary,
    },
    notifiedText: {
        fontSize: normalizeHeight(55),
        color: Colors.primary,
    },
    totalMinsText: {
        fontSize: normalizeHeight(55),
        color: Colors.primary,
    }
})