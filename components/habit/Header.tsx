import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native'
import { StyledText, StyledTextBold, StyledTextMedium } from '../StyledText';
import Colors from '../../constants/Colors';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HabitProps, HabitEditProps } from '../../services/habits/types';
import { StyledTextInput } from '../StyledTextInput';
import { formatTime, renderSequenceValue, calcDaysInARow } from '../../utils/tools';
import { ScrollView } from 'react-native-gesture-handler';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
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
    //         return <StyledText style={styles.totalMinsText}>{habit.notificationTime.totalMins ? habit.notificationTime.totalMins : '0'}</StyledText>
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
                    <StyledTextBold style={styles.headerText}>{habit.name}</StyledTextBold>
                    {!!habit.remove && <StyledText style={styles.remove}>{habit.remove}</StyledText>}
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

                        {edit ?
                            <View style={styles.dataItem}>
                                <View style={styles.timeContainer}>
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
                                    <Pressable style={styles.timeHeaderEdit} onPress={onTurnOnOffNotification}>
                                        {
                                            habitEdit.notificationOn
                                                ? <FontAwesome name="bell" size={normalizeHeight(45)} color={Colors.secondary} style={styles.bell} onPress={onTurnOnOffNotification} />
                                                : <FontAwesome name="bell-slash" size={normalizeHeight(45)} color={Colors.secondary} style={styles.bell} onPress={onTurnOnOffNotification} />
                                        }
                                    </Pressable>
                                </View>
                            </View>
                            :
                            <View style={styles.dataItem}>
                                <StyledTextBold style={styles.dataTimeText}>{formatTime(habit.startTime)} - {formatTime(habit.endTime)}</StyledTextBold>
                                {
                                    habit.notificationOn ?
                                        <FontAwesome name="bell" size={normalizeHeight(45)} color={Colors.secondary} style={styles.bell} /> :
                                        <FontAwesome name="bell-slash" size={normalizeHeight(45)} color={Colors.secondary} style={styles.bell} />
                                }
                            </View>

                        }

                        <View style={styles.dataItem}>
                            <StyledTextMedium style={styles.dataSeqText}>{habit.sequence.type}</StyledTextMedium>
                            <StyledText style={styles.dataSeqText}>{renderSequenceValue(habit)}</StyledText>
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
                                    : <StyledText style={styles.dataText}>{habit.locationDes}</StyledText>
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
                                    : <StyledText style={styles.dataText}>{habit.cue}</StyledText>
                            }
                        </View>

                    </View>


                    <View style={{ marginTop: 10 }}>

                        <View style={styles.dataItem}>
                            <Entypo name="bar-graph" size={normalizeHeight(40)} color={Colors.secondary} style={{ marginRight: 5 }} />
                            <StyledText style={styles.dataText}>{calcDaysInARow(habit.completedHabits)} day(s) in a row</StyledText>
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
                                        <StyledText style={styles.dataText}>{habit.notes}</StyledText>
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
    },
    timeHeaderEdit: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5
    },
    pickerItemStyle: {
        fontSize: normalizeHeight(55),
        color: Colors.primary,
        padding: normalizeWidth(10),
        height: normalizeHeight(30),
        borderRadius: 10
    },
    timeContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    datePicker: {
        fontSize: normalizeHeight(55),
        width: 100,
        height: '100%',
    },
    time: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center'
    },
    textInput: {
        fontSize: normalizeHeight(55),
        color: Colors.primary,
        borderRadius: 5,
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
        alignSelf: 'flex-start',
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
    dataTimeText: {
        fontSize: normalizeHeight(40),
        color: Colors.primary,
        marginRight: 5
    },
    dataSeqText: {
        fontSize: normalizeHeight(50),
        color: Colors.primary,
        marginRight: 2
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