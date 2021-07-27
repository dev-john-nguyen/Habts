import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { genCalendarVals } from '../utils/tools';
import Colors from '../constants/Colors';
import { normalizeWidth } from '../utils/styles';
import { FlatList } from 'react-native-gesture-handler';
import { StyledTextBold, StyledTextMedium } from './StyledText';

interface props {
    setActiveDate: (date: Date) => void;
    activeDate: Date;
}

interface DateProps {
    month: number;
    monthShort: string;
    day: number;
    dayName: string;
    year: number
}

export default ({ setActiveDate, activeDate }: props) => {
    const dates: DateProps[] = genCalendarVals()

    const onDayPress = (d: DateProps) => {
        if (!d) return;
        let date;
        if (isToday(d)) {
            date = new Date();
        } else {
            date = new Date(d.year, d.month, d.day);
        }
        setActiveDate(date)
    }

    const isToday = (d: DateProps) => {
        const today = new Date()
        return d.day === today.getDate() && d.month === today.getMonth() && d.year === today.getFullYear()
    }

    const isActiveDate = (d: DateProps): Boolean => {
        return d.day === activeDate.getDate() && d.month === activeDate.getMonth() && d.year === activeDate.getFullYear()
    }

    return (
        <FlatList
            style={styles.container}
            contentContainerStyle={styles.contentContainerStyle}
            horizontal={true}
            data={dates}
            renderItem={({ item, index }) => (
                <Pressable
                    key={index}
                    style={[styles.itemContainer, { backgroundColor: isActiveDate(item) ? Colors.primary : undefined }]}
                    onPress={() => onDayPress(item)}
                >
                    <StyledTextMedium style={[styles.text, { color: isActiveDate(item) ? Colors.white : Colors.primary }]}>{item.dayName}</StyledTextMedium>
                    <StyledTextBold style={[styles.dayText, { color: isActiveDate(item) ? Colors.white : Colors.primary }]}>{item.day}</StyledTextBold>
                    <View>
                    </View>
                </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        padding: normalizeWidth(20),
        height: 'auto'
    },
    contentContainerStyle: {
        paddingRight: 10,
        left: -normalizeWidth(20),
    },
    itemContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: normalizeWidth(60),
        padding: 10,
        borderRadius: 10
    },
    dayText: {
        fontSize: normalizeWidth(15)
    },
    text: {
        fontSize: normalizeWidth(30)
    }
})

