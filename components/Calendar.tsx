import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { genCalendarVals } from '../utils/tools';
import Colors from '../constants/Colors';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import { Picker } from '@react-native-picker/picker';

interface props {
    setActiveDate: (date: Date) => void;
    activeDate: Date;
}
export default ({ setActiveDate, activeDate }: props) => {
    const currentDate = new Date();
    const calendarVals: any[] = genCalendarVals(currentDate)
    const listRef: any = useRef();

    useEffect(() => {
        new Promise(resolve => setTimeout(resolve, 500))
            .then(handleScroll)
    }, [activeDate])

    const onDayPress = (day: string | number) => {
        if (!day) return;
        const selectedDate = new Date(activeDate.getFullYear(), activeDate.getMonth(), typeof day == 'number' ? day : parseInt(day), activeDate.getHours(), activeDate.getMinutes());
        setActiveDate(selectedDate)
    }

    const handleScroll = () => {
        listRef.current?.scrollToIndex({ index: activeDate.getDate() - 1, animated: true });
    }

    return (
        <Picker
            selectedValue={activeDate.getDate()}
            onValueChange={(itemValue: string | number, itemIndex: number) => onDayPress(itemValue)}
            itemStyle={styles.dayText}
        >
            {calendarVals.map((item, index) => (
                <Picker.Item label={item.toString()} value={item} key={item.toString()} />
            ))}
        </Picker>
    )
}

const styles = StyleSheet.create({
    dayText: {
        fontSize: normalizeWidth(10),
        color: Colors.white,
        padding: normalizeWidth(10),
        height: normalizeHeight(30),
        borderRadius: 10
    },
})

