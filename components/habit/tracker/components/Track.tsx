import React from 'react';
import { View, StyleSheet } from 'react-native';
import CircleCheck from '../../../../assets/svgs/CircleCheck';
import Colors from '../../../../constants/Colors';
import CirclSquare from '../../../../assets/svgs/CircleSquare';
import Badge from '../../../../assets/svgs/badge';
import { StyledTextMedium, StyledTextBold, StyledText } from '../../../StyledText';
import { normalizeWidth } from '../../../../utils/styles';
import XCircle from '../../../../assets/svgs/XCircle';
import { TrackProps } from '../types';
import AlertCircle from '../../../../assets/svgs/AlertCircle';

interface Props {
    type: TrackProps['type'];
    date: Date;
    badge?: {
        color: string;
        outline: boolean;
    };
    missCountRows?: number;
}

const Track = ({ type, date, badge, missCountRows }: Props) => {

    let borderColor = '';
    let icon;

    switch (type) {
        case 'check':
            icon = <CircleCheck color={Colors.green} />
            borderColor = Colors.primary
            break;
        case 'action':
            icon = (
                <View style={styles.circleSquare}>
                    <CirclSquare circleColor={Colors.primary} squareColor={Colors.white} />
                </View>
            )
            borderColor = Colors.primary;
            break;
        case 'miss':
            icon = <XCircle color={Colors.red} />
            borderColor = Colors.red;
            break;
        case 'warning':
            icon = <AlertCircle fillColor={Colors.white} strokeColor={Colors.orange} />
            borderColor = Colors.orange;
            break;
        case 'badge':
        default:
            if (badge) {
                icon = (
                    <View style={styles.badge}>
                        <Badge fill={badge.color} outlineBadge={badge.outline} style={{ top: 2 }} />
                    </View>
                )
                borderColor = Colors.primary
            } else {
                icon = (
                    <View style={styles.badge}>
                        <Badge fill={Colors.primary} outlineBadge={true} style={{ top: 2 }} />
                    </View>
                )
            }
    }

    const dateString = (date.getMonth() + 1) + '/' + date.getDate()

    return (
        <View style={[styles.container, {
            borderColor
        }]}>
            <View style={{ flexDirection: 'row' }}>
                <View style={[styles.dateContainer, { backgroundColor: borderColor }]}>
                    <StyledTextMedium style={styles.date}>
                        {dateString}
                    </StyledTextMedium>
                </View>
                <View style={styles.missCountContainer}>
                    {
                        missCountRows &&
                        <StyledTextBold style={styles.missCountText}>
                            x {missCountRows}
                        </StyledTextBold>

                    }
                </View>
            </View>
            <View style={styles.iconContainer}>
                {icon}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: Colors.white,
        width: normalizeWidth(8),
        height: normalizeWidth(8)
    },
    badge: {
        height: normalizeWidth(10),
        width: normalizeWidth(10),
        top: 6
    },
    iconContainer: {
        flex: .9,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    dateContainer: {
        flex: 1,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    date: {
        fontSize: normalizeWidth(45),
        textAlign: 'center',
        flexWrap: 'nowrap',
        color: Colors.white
    },
    circleSquare: {
        height: normalizeWidth(12), width: normalizeWidth(12),
        alignItems: 'center',
        justifyContent: 'center'
    },
    missCountContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .8
    },
    missCountText: {
        fontSize: normalizeWidth(50),
        color: Colors.red
    }
})

export default Track;