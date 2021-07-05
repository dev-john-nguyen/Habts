import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Colors from '../../../constants/Colors';
import { normalizeWidth } from '../../../utils/styles';
import { CompletedHabitsProps } from '../../../services/habits/types';
import Track from './components/Track';
import { AsapTextMedium, AsapTextBold } from '../../StyledText';
import { TrackProps } from './types';
import { Feather } from '@expo/vector-icons';

interface Props {
    completedHabits: CompletedHabitsProps[];
    activeDay: number;
    handleAddCompletedHabit: () => void;
    startDate: Date;
    endDate?: Date;
}

type DataArray = Array<{
    date: Date,
    type: TrackProps['type'],
    missCountRows?: number
}>


const Tracker = ({ completedHabits, handleAddCompletedHabit, activeDay, startDate }: Props) => {
    const [data, setData] = useState<DataArray>();


    const isSameDate = (d1: Date, d2: Date) => {
        return (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate())
    }

    useEffect(() => {
        //get the difference between today and the start date
        let d = new Date();
        let startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - 30).getTime();
        let todaysDate = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        let diff = todaysDate - startDateTime;
        let diffInDays = diff / (1000 * 3600 * 24);

        let preparedData: DataArray = [];
        let missCount = 0;
        let missSDate;

        for (let i = diffInDays; i >= 0; i--) {
            let cDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i);

            //check if completed
            let foundCompleted = completedHabits.find(({ dateCompleted }) => {
                return isSameDate(dateCompleted, cDate)
            })

            if (foundCompleted) {
                //end misscount
                if (missSDate) {
                    preparedData.push({
                        date: missSDate,
                        type: 'miss',
                        missCountRows: missCount - 5
                    })
                }

                preparedData.push({
                    date: cDate,
                    type: 'check'
                })

                //reset missCount and missSDate
                missCount = 0;
                missSDate = undefined;
                continue;
            }

            //check if multiple misses
            if (missCount) {
                //missed twice
                if (missCount < 5) {
                    preparedData.push({
                        date: cDate,
                        type: 'miss'
                    })
                }

                if (i < 1) {
                    if (missSDate) {
                        preparedData.push({
                            date: missSDate,
                            type: 'miss',
                            missCountRows: missCount - 5
                        })
                    }
                    preparedData.push({
                        date: cDate,
                        type: 'action'
                    })
                }

                if (missCount === 5) {
                    missSDate = cDate
                }

                missCount++
                continue;
            }

            preparedData.push({
                date: cDate,
                type: 'warning'
            })

            missCount++
        }

        setData(preparedData)

    }, [completedHabits])

    return (
        <View style={styles.container}>
            <FlatList
                horizontal={false}
                data={data}
                numColumns={5}
                keyExtractor={(item, index) => item.date.toTimeString() + index}
                style={{ flex: 1 }}
                contentContainerStyle={styles.contentContainerStyle}
                columnWrapperStyle={styles.columnWrapperStyle}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.itemContainer}>
                            <Track
                                type={item.type}
                                date={item.date}
                                badge={{
                                    color: Colors.primary,
                                    outline: true
                                }}
                                missCountRows={item.missCountRows}
                            />
                        </View>
                    )
                }}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.contentBg,
        padding: normalizeWidth(30),
        flex: 1,
        borderRadius: 10
    },
    contentContainerStyle: {
        alignItems: 'flex-end',
        flexDirection: 'column-reverse'
    },
    columnWrapperStyle: {
        marginBottom: normalizeWidth(30)
    },
    itemContainer: {
        marginLeft: (normalizeWidth(30) / 2),
        marginRight: (normalizeWidth(30) / 2)
    }
})

export default Tracker;