import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Colors from '../../../constants/Colors';
import { normalizeWidth } from '../../../utils/styles';
import { CompletedHabitsProps, HabitProps } from '../../../services/habits/types';
import Track from './components/Track';
import { TrackProps } from './types';

interface Props {
    completedHabits: CompletedHabitsProps[];
    activeDay: number;
    handleAddCompletedHabit: () => void;
    startDate: Date;
    endDate?: Date;
    consecutive: HabitProps['consecutive'];
}

type DataArray = Array<{
    date: Date,
    type: TrackProps['type'],
    missCountRows?: number,
    badge?: {
        color: string;
        outline: boolean;
    }
}>

type BadgeProps = Array<{
    date: Date;
    key: string;
    color: string;
    outline: boolean;
}>


const Tracker = ({ completedHabits, startDate, consecutive }: Props) => {
    const [data, setData] = useState<DataArray>();


    const isSameDate = (d1: Date, d2: Date) => {
        return (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate())
    }

    useEffect(() => {
        let badgeData: BadgeProps = [];

        Object.keys(consecutive).forEach((goalKey, i) => {
            const { count, goal } = consecutive[goalKey];
            if (count.length > 0 && count.length === goal && goal > 0) {
                let color = '';
                let outline = false;

                switch (goalKey) {
                    case 'one':
                        color = Colors.primary;
                        outline = true;
                        break;
                    case 'two':
                        color = Colors.primary
                        outline = false;
                        break;
                    case 'three':
                        color = Colors.yellow
                        outline = true;
                        break;
                    case 'four':
                    default:
                        color = Colors.yellow
                        outline = false
                        break;
                }

                badgeData.unshift({
                    date: count[count.length - 1].dateCompleted,
                    key: goalKey,
                    color,
                    outline
                })
            }
        })

        //get the difference between today and the start date
        let d = new Date();
        let startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - 100).getTime();
        let todaysDate = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        let diff = todaysDate - startDateTime;
        let diffInDays = Math.ceil(diff / (1000 * 3600 * 24));

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
                    preparedData.unshift({
                        date: missSDate,
                        type: 'miss',
                        missCountRows: missCount - 5
                    })
                }

                //check if set badge 
                let isBadgeItem = badgeData.find((b) => foundCompleted && isSameDate(b.date, foundCompleted.dateCompleted))

                if (isBadgeItem) {
                    preparedData.unshift({
                        date: cDate,
                        type: 'badge',
                        badge: isBadgeItem
                    })
                } else {
                    preparedData.unshift({
                        date: cDate,
                        type: 'check'
                    })
                }

                //reset missCount and missSDate
                missCount = 0;
                missSDate = undefined;
                continue;
            }

            //check if multiple misses
            if (missCount) {
                //missed twice
                if (missCount < 5) {
                    preparedData.unshift({
                        date: cDate,
                        type: 'miss'
                    })
                }

                if (i < 1) {
                    if (missSDate) {
                        preparedData.unshift({
                            date: missSDate,
                            type: 'miss',
                            missCountRows: missCount - 5
                        })
                    }
                    preparedData.unshift({
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

            if (i < 1) {
                preparedData.unshift({
                    date: cDate,
                    type: 'action'
                })
            } else {
                preparedData.unshift({
                    date: cDate,
                    type: 'warning'
                })
            }
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
                                badge={item.badge}
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
        alignItems: 'flex-start'
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