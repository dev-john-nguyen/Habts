import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'
import { AsapText, LatoText } from '../StyledText';
import Colors from '../../constants/Colors';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HabitProps, HabitEditProps } from '../../services/habits/types';
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


    const luxNow = DateTime.now()

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

    const onShowNotes = () => setShowNotes && setShowNotes(showNotes ? false : true);

    const onUpdateNotes = (text: string) => habitEdit && setHabitEdit({ ...habitEdit, notes: text });

    return (
        <View style={[styles.container, Colors.boxShadow, { borderRadius: newCom ? 20 : undefined }]}>
            <View style={styles.header}>
                <View>
                    <LatoText style={styles.headerSubText}>{habit.remove}</LatoText>
                    <AsapText style={styles.headerText}>{habit.name}</AsapText>
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
                <View style={styles.data}>
                    <View style={styles.dataItem}>
                        <Entypo name="calendar" size={normalizeHeight(40)} color={Colors.veryLightGrey} />
                        <LatoText style={styles.dataText}>{habit.sequence.type} {renderSequenceValue(habit)}</LatoText>
                    </View>
                    <View style={styles.dataItem}>
                        <Entypo name="clock" size={normalizeHeight(40)} color={Colors.veryLightGrey} />
                        {edit ?
                            <View style={styles.timeContainer}>
                                <View style={styles.time}>
                                    <AsapText style={styles.timeText}>Start Time: </AsapText>
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
                                    <AsapText style={styles.timeText}>End Time: </AsapText>
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
                            : <LatoText style={styles.dataText}>{formatTime(habit.startTime)} - {formatTime(habit.endTime)}</LatoText>
                        }
                    </View>

                    <View style={styles.dataItem}>
                        {
                            edit ?
                                habitEdit.notificationOn
                                    ? <Entypo name="bell" size={normalizeHeight(40)} color={Colors.veryLightGrey} style={styles.bell} onPress={() => edit && setHabitEdit({ ...habitEdit, notificationOn: false })} />
                                    : <Entypo name="sound-mute" size={normalizeHeight(40)} color={Colors.veryLightGrey} style={styles.bell} onPress={() => edit && setHabitEdit({ ...habitEdit, notificationOn: true })} />
                                : habit.notificationOn ? <Entypo name="bell" size={normalizeHeight(40)} color={Colors.veryLightGrey} style={styles.bell} onPress={() => edit && setHabitEdit({ ...habitEdit, notificationOn: false })} />
                                    : <Entypo name="sound-mute" size={normalizeHeight(40)} color={Colors.veryLightGrey} style={styles.bell} onPress={() => edit && setHabitEdit({ ...habitEdit, notificationOn: true })} />
                        }
                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                            <LatoText style={styles.dataText}>Notify </LatoText>
                            {renderNotificationEdit()}
                            <LatoText style={styles.notifiedText}> mins before.</LatoText>
                        </View>
                    </View>

                    <View style={styles.dataItem}>
                        <MaterialCommunityIcons name="sigma" size={normalizeHeight(40)} color={Colors.veryLightGrey} />
                        <LatoText style={styles.dataText}>{habit.completedHabits.length}</LatoText>
                    </View>

                    <View style={styles.dataItem}>
                        <Entypo name="link" size={normalizeHeight(40)} color={Colors.veryLightGrey} />
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
                                : <LatoText style={styles.dataText}>{habit.cue}</LatoText>
                        }
                    </View>

                    <View style={styles.dataItem}>
                        <Entypo name="location-pin" size={normalizeHeight(40)} color={Colors.veryLightGrey} />
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
                                : <LatoText style={styles.dataText}>{habit.locationDes}</LatoText>
                        }
                    </View>

                    <View style={styles.dataItem}>
                        <Entypo name="text-document" size={normalizeHeight(40)} color={Colors.veryLightGrey} onPress={onShowNotes} />
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
                                    <LatoText style={styles.dataText}>{habit.notes}</LatoText>
                                </ScrollView>
                        }
                    </View>
                </View>
            }

            <HabitBadges consecutive={habit.consecutive} size={normalizeHeight(25)} infoText="Earn your first badge by completing 21 consecutive days." />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: normalizeHeight(14),
        minHeight: normalizeHeight(2),
        backgroundColor: Colors.primary,
        borderBottomEndRadius: 20,
        borderBottomLeftRadius: 20,
    },
    header: {
        alignItems: 'center',
        borderBottomColor: Colors.secondary,
        borderBottomWidth: 1
    },
    pickerItemStyle: {
        fontSize: normalizeHeight(60),
        color: Colors.white,
        padding: normalizeWidth(10),
        height: normalizeHeight(30),
        borderRadius: 10
    },
    timeText: {
        fontSize: normalizeHeight(60),
        color: Colors.white
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
        borderColor: Colors.white,
        padding: 10,
        paddingTop: 10,
        flex: 1,
        maxHeight: 100,
        backgroundColor: Colors.veryLightGrey
    },
    bell: {

    },
    headerText: {
        fontSize: normalizeHeight(25),
        color: Colors.white,
        alignSelf: 'center',
        textTransform: 'capitalize'
    },
    headerSubText: {
        fontSize: normalizeHeight(70),
        color: Colors.white,
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
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    dataText: {
        fontSize: normalizeHeight(55),
        color: Colors.white,
        marginLeft: 10
    },
    notifiedText: {
        fontSize: normalizeHeight(55),
        color: Colors.white,
    },
    totalMinsText: {
        fontSize: normalizeHeight(55),
        color: Colors.white,
    }
})