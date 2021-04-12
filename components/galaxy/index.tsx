import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, PanResponder, Easing, Pressable } from 'react-native';
import Colors from '../../constants/Colors';
import { cloneDeep } from 'lodash'
import { CompletedHabitsProps } from '../../services/habits/types';
import { getDate } from '../../utils/tools';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import Layout from '../../constants/Layout';
import Stars from './Stars';
import SmallStars from '../Stars';
import HabitGuy from '../../assets/svgs/habitGuy';
import { AsapText } from '../StyledText';
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import RotateGalaxy from './RotateGalaxy';


//notes: will need to update server/redux every time a user drops a ball into the container!
//only allow one drop per day
//have a message indicating the accomplishment

interface DropBallJarProps {
    completedHabits: CompletedHabitsProps[];
    handleAddCompletedHabit: () => void;
    activeDay: number;
}

export default ({ completedHabits, handleAddCompletedHabit, activeDay }: DropBallJarProps) => {
    const currentDate = new Date();
    const [balls, setBalls] = useState<CompletedHabitsProps[]>([]);
    const [completed, setCompleted] = useState(false);
    const ballPositionY: any = useRef(new Animated.Value(0)).current;
    const ballPositionX: any = useRef(new Animated.Value(0)).current;
    const galaxyOffSet = useRef(0)
    const galaxyHeight = useRef(0)
    const ballFade = useRef(new Animated.Value(1)).current;
    const ballSize = useRef(new Animated.Value(normalizeWidth(10))).current;
    const ballTextSize = useRef(new Animated.Value(normalizeWidth(30))).current;
    const quotes = useRef({ thumb: false, quote: completedHabits.length < 2 ? "Let's start this off right." : 'Keep at it!' })

    const ballIntoGalaxy = () => {
        if (completed) return;
        const ballToPositionY = galaxyHeight.current / 2;

        Animated.parallel([Animated.timing(ballPositionY, {
            toValue: ballToPositionY,
            duration: 1500,
            useNativeDriver: false
        }),
        Animated.timing(ballTextSize, {
            toValue: normalizeWidth(70),
            duration: 1500,
            useNativeDriver: false
        }),
        Animated.timing(ballSize, {
            toValue: normalizeWidth(20),
            duration: 1500,
            useNativeDriver: false
        }),
        Animated.timing(ballFade, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false
        }),
        ]).start(() => {
            handleAddCompletedHabit()
        })
    }

    useEffect(() => {
        if (completedHabits && completedHabits.length > 0) {
            var balls = cloneDeep(completedHabits);

            balls.sort((a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime());

            const todayCompleted = balls.findIndex(item => getDate(item.dateCompleted) == getDate(currentDate))

            if (todayCompleted >= 0) {
                setCompleted(true);
                quotes.current = {
                    thumb: true,
                    quote: 'Good job!'
                }
            }

            if (balls.length > 20) {
                setBalls([...balls.splice(0, 20)])
            } else {
                setBalls(balls)
            }
        }

        if (activeDay !== currentDate.getDate()) {
            setCompleted(true);
            quotes.current = {
                thumb: false,
                quote: "Go back to today to complete your habit!"
            }
        }

    }, [completedHabits])


    return (
        <View style={styles.container}>
            <View style={styles.ballContainer}>
                {!completed && <Animated.View
                    style={[{
                        transform: [{ translateX: ballPositionX }, { translateY: ballPositionY }],
                        opacity: ballFade,
                        height: ballSize,
                        width: ballSize
                    }, styles.ball]}
                >
                    <Animated.Text style={[
                        { fontSize: ballTextSize },
                        styles.ballText
                    ]}>
                        {currentDate.getMonth() + 1}/{currentDate.getDate()}
                    </Animated.Text>
                </Animated.View>
                }
                <Pressable style={styles.habitGuy} onPress={ballIntoGalaxy}>
                    <AsapText style={styles.tap}>Tap</AsapText>
                    <HabitGuy />
                </Pressable>
                <View style={styles.messageContainer}>
                    <AsapText style={styles.message}>{quotes.current.quote}  </AsapText>
                    {quotes.current.thumb && <Entypo name="thumbs-up" size={normalizeHeight(35)} color={Colors.white} />}
                </View>
            </View>
            <View
                style={styles.galaxyContainer}
                onLayout={({ nativeEvent }) => {
                    galaxyOffSet.current = nativeEvent.layout.y
                    galaxyHeight.current = nativeEvent.layout.height
                }}
            >
                <RotateGalaxy balls={balls} />
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 120
    },
    tap: {
        position: 'absolute',
        right: 50,
        top: 33,
        zIndex: 20,
        color: Colors.white,
        fontSize: normalizeWidth(40)
    },
    gradientBorder: {
        height: normalizeWidth(1),
        width: normalizeWidth(1),
        borderRadius: normalizeWidth(2),
        justifyContent: 'center',
        alignItems: 'center'
    },
    gradientGalaxy: {
        height: normalizeWidth(1.05),
        width: normalizeWidth(1.05),
        borderRadius: normalizeWidth(1.05) / 2,
    },
    rotateContainer: {
        height: normalizeWidth(1.05),
        width: normalizeWidth(1.05),
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 1000
    },
    habitGuy: {
        position: 'absolute',
        top: -50,
        left: normalizeWidth(2.5),
        zIndex: -1,
        height: 150,
        width: 150
    },
    centerStar: {
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: normalizeWidth(10),
        width: normalizeWidth(10),
        backgroundColor: Colors.yellow,
        zIndex: 0,
        borderRadius: 100
    },
    centerStartText: {
        color: Colors.primary,
        fontSize: normalizeWidth(22)
    },
    ballContainer: {
        alignItems: 'center',
        height: normalizeWidth(12)
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: -normalizeWidth(3.5),
        marginLeft: 10,
        padding: 20,
        zIndex: -10,
    },
    message: {
        fontSize: normalizeHeight(50),
        color: Colors.white,
        marginLeft: 10,
        textTransform: 'capitalize',
        textAlign: 'center'
    },
    ball: {
        backgroundColor: Colors.white,
        borderRadius: 100,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    ballText: {
        fontFamily: 'Asap_400Regular',
        color: Colors.primary,
        fontSize: normalizeWidth(35),
    },
    galaxyContainer: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: normalizeHeight(4)
    },
})