import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { genCalendarVals } from '../utils/tools';
import Colors from '../constants/Colors';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import { FlatList } from 'react-native-gesture-handler';
import { AsapText } from './StyledText';
import { Entypo } from '@expo/vector-icons';

interface props {
    setActiveDate: (date: Date) => void;
    activeDate: Date;
    setShowCal: (show: boolean) => void;
}

interface DateProps {
    month: number;
    monthShort: string;
    day: number;
    dayName: string;
    year: number
}

export default ({ setActiveDate, activeDate, setShowCal }: props) => {
    const dates: DateProps[] = genCalendarVals()
    // const listRef: any = useRef();

    // useEffect(() => {
    //     handleScroll()
    // }, [activeDate])

    const onDayPress = (d: DateProps) => {
        if (!d) return;
        const selectedDate = new Date(d.year, d.month, d.day)
        setActiveDate(selectedDate)
        setShowCal(false)
    }

    // const handleScroll = () => {
    //     const index = dates.findIndex(d => isActiveDate(d));

    //     if (index < 0) {
    //         return;
    //     }

    //     new Promise(resolve => setTimeout(resolve, 500))
    //         .then(() => {
    //             listRef && listRef.current && listRef.current.scrollToIndex({
    //                 index: index,
    //                 animated: true
    //             })
    //         })

    //     //find the index of current date
    // }

    const isActiveDate = (d: DateProps): Boolean => {
        return d.day === activeDate.getDate() && d.month === activeDate.getMonth() && d.year === activeDate.getFullYear()
    }

    // const index = dates.findIndex(d => isActiveDate(d));

    return (
        <>
            <FlatList
                style={styles.container}
                data={dates}
                renderItem={({ item, index }) => (
                    <Pressable
                        key={index}
                        style={[styles.dateContainer, { backgroundColor: isActiveDate(item) ? Colors.white : undefined }]}
                        onPress={() => onDayPress(item)}
                    >
                        <AsapText style={[styles.dayText, { color: isActiveDate(item) ? Colors.primary : Colors.white }]}>{item.day}</AsapText>
                        <View>
                            <AsapText style={[styles.text, { color: isActiveDate(item) ? Colors.primary : Colors.white }]}>{item.dayName}</AsapText>
                            <AsapText style={[styles.text, { color: isActiveDate(item) ? Colors.primary : Colors.white }]}>{item.monthShort} {item.year}</AsapText>
                        </View>
                    </Pressable>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        height: normalizeHeight(10),
        width: normalizeWidth(2.5),
        padding: 2,
        backgroundColor: Colors.secondary,
        borderRadius: 10
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 2,
    },
    dayText: {
        fontSize: normalizeWidth(7),
        marginRight: 10
    },
    text: {
        fontSize: normalizeWidth(22)
    }
})

