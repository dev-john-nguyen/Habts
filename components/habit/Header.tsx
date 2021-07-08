import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native'
import { AsapText, AsapTextBold, AsapTextMedium } from '../StyledText';
import Colors from '../../constants/Colors';
import { Entypo } from '@expo/vector-icons';
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
import { consecutiveTools } from '../../services/habits/utils/consecutive';

interface HabitHeader {
    habit: HabitProps;
    edit: boolean;
    setHabitEdit: (habit: HabitEditProps) => void;
    habitEdit: HabitEditProps;
    showNotes?: boolean;
    newCom?: boolean;
}


export default ({ habit, newCom, edit, setHabitEdit, habitEdit }: HabitHeader) => {
    const [showNotes, setShowNotes] = useState(false);


    const luxNow = DateTime.now();

    // const renderNotificationEdit = () => {
    //     if (edit) {
    //         return <Picker
    //             selectedValue={habitEdit.notificationTime.totalMins}
    //             onValueChange={(itemValue: any, itemIndex: number) => setHabitEdit({ ...habitEdit, notificationTime: { ...habitEdit.notificationTime, totalMins: parseInt(itemValue) } })}
    //             itemStyle={styles.pickerItemStyle}
    //         >
    //             {arrayOfNums(61).map((item) => (
    //                 <Picker.Item label={item.toString()} value={item} key={item.toString()} />
    //             ))}
    //         </Picker>
    //     } else {
    //         return <AsapText style={styles.totalMinsText}>{habit.notificationTime.totalMins ? habit.notificationTime.totalMins : '0'}</AsapText>
    //     }
    // }

    const onShowNotes = () => setShowNotes(showNotes ? false : true);

    const onUpdateNotes = (text: string) => habitEdit && setHabitEdit({ ...habitEdit, notes: text });


    const onTurnOnOffNotification = () => {
        edit && setHabitEdit({ ...habitEdit, notificationOn: habitEdit.notificationOn ? false : true })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <AsapTextBold style={styles.headerText}>{habit.name}</AsapTextBold>
                    {!!habit.remove && <AsapText style={styles.remove}>{habit.remove}</AsapText>}
                </View>
            </View>
            <View style={styles.underline} />
            {showNotes ?
                <Notes
                    notes={habit.notes}
                    onClose={onShowNotes}
                    edit={edit}
                    editNotes={habitEdit.notes}
                    updateNotes={onUpdateNotes}
                />
                :
                <View style={edit ? styles.contentEditBg : {}}>
                    <View>
                        <View style={styles.dataItem}>
                            {edit ?
                                <View style={styles.timeContainer}>
                                    <Pressable style={styles.timeHeaderEdit} onPress={onTurnOnOffNotification}>
                                        <AsapTextBold style={styles.timeText}>Time</AsapTextBold>
                                        {
                                            habitEdit.notificationOn
                                                ? <Entypo name="bell" size={normalizeHeight(40)} color={Colors.secondary} style={styles.bell} onPress={onTurnOnOffNotification} />
                                                : <Entypo name="sound-mute" size={normalizeHeight(40)} color={Colors.secondary} style={styles.bell} onPress={onTurnOnOffNotification} />
                                        }
                                    </Pressable>
                                    <View style={styles.time}>
                                        <DateTimePicker
                                            value={habitEdit.startTime.date}
                                            minuteInterval={5}
                                            mode='time'
                                            is24Hour={true}
                                            display="default"
                                            onChange={(e: any, date: any) => setHabitEdit({ ...habitEdit, startTime: { date: new Date(date), hour: date.getHours(), minute: date.getMinutes(), zoneName: luxNow.zoneName } })}
                                            style={styles.datePicker}
                                        />
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
                                        habit.notificationOn ?
                                            <Entypo name="bell" size={normalizeHeight(50)} color={Colors.secondary} style={styles.bell} /> :
                                            <Entypo name="sound-mute" size={normalizeHeight(50)} color={Colors.secondary} style={styles.bell} />
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
                            <Entypo name="bar-graph" size={normalizeHeight(40)} color={Colors.secondary} style={{ marginRight: 5 }} />
                            <AsapTextMedium style={styles.dataText}>{consecutiveTools.getCurrentConsecutiveTotal(habit.consecutive)} day(s) in a row</AsapTextMedium>
                        </View>

                        <View style={styles.dataItem}>
                            <Entypo name="text-document" size={normalizeHeight(35)} color={Colors.secondary} onPress={onShowNotes} style={{ marginRight: 5 }} />
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    },
    header: {
    },
    underline: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.contentBg,
        marginBottom: 5
    },
    contentEditBg: {
        backgroundColor: Colors.contentBg,
        borderRadius: 10,
        padding: 10
    },
    timeHeaderEdit: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    pickerItemStyle: {
        fontSize: normalizeHeight(55),
        color: Colors.primary,
        padding: normalizeWidth(10),
        height: normalizeHeight(30),
        borderRadius: 10
    },
    timeText: {
        fontSize: normalizeHeight(45),
        color: Colors.primary,
        marginRight: 2
    },
    timeContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    datePicker: {
        fontSize: normalizeHeight(55),
        width: 100,
        height: '100%',
    },
    time: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center'
    },
    textInput: {
        fontSize: normalizeHeight(55),
        color: Colors.primary,
        borderRadius: 10,
        padding: 10,
        paddingTop: 10,
        flex: 1,
        maxHeight: 100,
        backgroundColor: Colors.white
    },
    bell: {

    },
    headerText: {
        fontSize: normalizeHeight(20),
        color: Colors.primary,
        textTransform: 'capitalize'
    },
    remove: {
        fontSize: normalizeHeight(70),
        color: Colors.primary,
        textDecorationLine: 'line-through',
        alignSelf: 'flex-end',
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
        fontSize: normalizeHeight(55),
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