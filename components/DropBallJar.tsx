import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, PanResponder, ImageBackground, Easing, PanResponderGestureState, GestureResponderEvent } from 'react-native';
import { AsapText, AsapTextBold } from './StyledText';
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { cloneDeep } from 'lodash'
import { Entypo } from '@expo/vector-icons';
import { CompletedHabitsProps } from '../services/habits/types';
import { getDate, getMonthShort } from '../utils/tools';
import { normalizeHeight, normalizeWidth } from '../utils/styles';


//notes: will need to update server/redux every time a user drops a ball into the container!
//only allow one drop per day
//have a message indicating the accomplishment

interface DropBallJarProps {
    completedHabits: CompletedHabitsProps[];
    setScrollEnabled: (value: boolean) => void;
    handleAddCompletedHabit: () => void;
    activeDay: number;
}

const ballsPaddingBottom = normalizeHeight(15);

export default ({ setScrollEnabled, completedHabits, handleAddCompletedHabit, activeDay }: DropBallJarProps) => {
    const currentDate = new Date();
    const [balls, setBalls] = useState<CompletedHabitsProps[]>([]);
    const [completed, setCompleted] = useState(false);
    const ballPositionY: any = useRef(new Animated.Value(0)).current;
    const ballPositionX: any = useRef(new Animated.Value(0)).current;
    const ballZIndex: any = useRef(new Animated.Value(0)).current;
    const ballWidth = useRef(0);
    const ballHeight = useRef(0);
    const jarYOffSet = useRef(0)
    const jarHeight = useRef(0)
    const jarBallsHeight = useRef(0)
    const jarBallsWidth = useRef(0);
    const jarBallsTransformY = useRef(new Animated.Value(0)).current;
    const quotes = useRef({ thumb: false, quote: 'One day at a time!' })

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (e, gestureState) => true,
        onPanResponderGrant: () => {
            setScrollEnabled(false)

            quotes.current.quote = 'Lets go! Another one!'

            ballPositionX.setOffset(ballPositionX._value)

            ballPositionY.setOffset(ballPositionY._value)
        },
        onPanResponderMove: Animated.event(
            [
                null,
                { dx: ballPositionX, dy: ballPositionY },
            ],
            { useNativeDriver: false })
        ,
        onPanResponderRelease: (evt, gestureState) => {
            if (ballPositionY._value > jarYOffSet.current) {
                handleDropBallAction(gestureState.moveX)
            } else {
                Animated.parallel([
                    Animated.spring(ballPositionY, {
                        toValue: 0,
                        useNativeDriver: false
                    }),
                    Animated.spring(ballPositionX, {
                        toValue: 0,
                        useNativeDriver: false
                    }),
                ]).start()

                quotes.current.quote = 'Almost got it!'
            }

            setScrollEnabled(true)
        }
    })

    const handleDropBallAction = (xPosition: number) => {
        //figure out which position the ball will go to
        const remainder = balls.length % 6

        let ballToPositionX = 0;
        let ballToPositionY = ((jarYOffSet.current + jarHeight.current) - (jarBallsHeight.current + ballsPaddingBottom - 1))
        const jarBallsHalfWidth = (jarBallsWidth.current / 1.90) - (ballWidth.current / 1.6);

        const ballsAdjustWidth = (ballWidth.current * remainder)

        switch (remainder) {
            case 0:
                ballToPositionX = -jarBallsHalfWidth;
                ballToPositionY = ballToPositionY - (ballHeight.current - 1);
                break;
            case 1:
                ballToPositionX = -(jarBallsHalfWidth - ballsAdjustWidth);
                break;
            case 2:
                ballToPositionX = -(jarBallsHalfWidth - ballsAdjustWidth);
                break;
            case 3:
                ballToPositionX = -(jarBallsHalfWidth - ballsAdjustWidth);
                // if (xPosition < normalizeWidth(2)) {
                //     ballToPositionY = ballToPositionY + ballHeight.current
                // }
                break;
            case 4:
                ballToPositionX = -(jarBallsHalfWidth - ballsAdjustWidth);
                break;
            case 5:
                ballToPositionX = -(jarBallsHalfWidth - ballsAdjustWidth);
                break;
            case 6:
                ballToPositionX = -(jarBallsHalfWidth - ballsAdjustWidth);
                break;
            default:
                ballToPositionX = -jarBallsHalfWidth;
        }

        Animated.parallel([
            Animated.timing(ballZIndex, {
                toValue: 100,
                duration: 1000,
                useNativeDriver: false
            }),
            Animated.timing(ballPositionY, {
                toValue: ballToPositionY,
                duration: 2000,
                easing: Easing.bounce,
                useNativeDriver: false
            }),
            Animated.timing(ballPositionX, {
                toValue: ballToPositionX,
                duration: 2000,
                useNativeDriver: false
            }),
        ]).start(() => {
            addBall()
        })

        quotes.current = {
            thumb: true,
            quote: 'Good Job!'
        }

    }

    const ballResponder = useRef(panResponder);


    useEffect(() => {
        ballResponder.current = panResponder;
    }, [balls])

    useEffect(() => {
        if (completedHabits && completedHabits.length > 0) {
            var balls = cloneDeep(completedHabits);

            balls.sort((a, b) => a.dateCompleted.getTime() - b.dateCompleted.getTime());

            const todayCompleted = balls.findIndex(item => getDate(item.dateCompleted) == getDate(currentDate))

            if (todayCompleted >= 0) {
                setCompleted(true);
                quotes.current = {
                    thumb: true,
                    quote: 'Today has been completed! Good job!'
                }
            }

            if (balls.length >= 65) {
                setBalls([...balls.splice(0, 65)])
            } else {
                setBalls([...balls])
            }
        }

        if (activeDay !== currentDate.getDate()) {
            setCompleted(true);
            quotes.current = {
                thumb: false,
                quote: "Go back to today to complete your habit!"
            }
        }

    }, [])

    const addBall = () => {
        // dropBalls()
        handleAddCompletedHabit()
    }

    const dropBalls = () => {
        const toBallY = ballPositionY._value + ballHeight.current
        Animated.parallel([
            Animated.timing(jarBallsTransformY, {
                useNativeDriver: false,
                toValue: ballHeight.current,
                duration: 1000
            }),
            Animated.timing(ballPositionY, {
                useNativeDriver: false,
                toValue: toBallY,
                duration: 1000
            })
        ]).start()
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.ballContainer, { zIndex: ballZIndex }]}>
                {
                    <Animated.View
                        style={{
                            transform: [{ translateX: ballPositionX }, { translateY: ballPositionY }]
                        }}
                        {...ballResponder.current.panHandlers}
                    >
                        <View
                            style={styles.ball}
                            ref={view => view?.measure((fx, fy, width, height, px, py) => {
                                ballWidth.current = width;
                                ballHeight.current = height;
                            })}
                        >
                            <AsapText style={styles.ballText}>{new Date().getDate()}</AsapText>
                            <AsapText style={styles.ballSubText}>{getMonthShort(new Date())}</AsapText>
                            <LinearGradient
                                colors={[`rgba(255,255,255,.2)`, Colors.secondary, Colors.primary]}
                                style={styles.ballGlare}
                            />
                        </View>
                    </Animated.View>
                }
                <View style={styles.messageContainer}>
                    {quotes.current.thumb && <Entypo name="thumbs-up" size={normalizeWidth(20)} color={Colors.white} />}
                    <AsapText style={styles.message}>{quotes.current.quote}</AsapText>
                </View>
            </Animated.View>
            <View
                style={styles.jar}
                ref={view => view?.measure((fx, fy, width, height, px, py) => {
                    jarYOffSet.current = fy
                    jarHeight.current = height
                })}
            >
                <AsapText style={styles.count}>count: <AsapTextBold style={styles.count}>{completedHabits.length}</AsapTextBold></AsapText>
                <ImageBackground
                    style={styles.jarBallsContainer}
                    source={require('../assets/svgs/jar.png')}
                    imageStyle={{
                        resizeMode: 'stretch'
                    }}
                >
                    <View style={styles.jarBalls}
                        ref={view => view?.measure((fx, fy, width, height, px, py) => {
                            jarBallsHeight.current = height;
                            jarBallsWidth.current = width;
                        })}
                    >
                        <Animated.View style={{
                            flex: 1, flexDirection: 'row',
                            flexWrap: 'wrap-reverse',
                            justifyContent: 'flex-start',
                            transform: [{ translateY: jarBallsTransformY }]
                        }}>
                            {balls.length > 0 && balls.map((item, index) => (
                                <View style={[styles.ball]} key={index}>
                                    <AsapText style={styles.ballText}>{item.dateCompleted.getDate()}</AsapText>
                                    <AsapText style={styles.ballSubText}>{getMonthShort(item.dateCompleted)}</AsapText>
                                    <LinearGradient
                                        colors={[`rgba(255,255,255,.2)`, Colors.secondary, Colors.primary]}
                                        style={styles.ballGlare}
                                    />
                                </View>
                            ))}
                        </Animated.View>
                    </View>
                </ImageBackground>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        marginBottom: 20
    },
    ballContainer: {
        height: normalizeHeight(5),
        alignItems: 'center',
    },
    count: {
        color: Colors.white,
        fontSize: normalizeWidth(30),
        position: 'absolute',
        right: normalizeWidth(20),
        top: -normalizeHeight(10)
    },
    ballGlare: {
        position: 'absolute',
        right: 0,
        top: 6,
        width: 25,
        height: 5,
        borderRadius: 10,
        transform: [{ rotate: '45deg' }]
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: -50,
        marginLeft: 10,
        padding: 20,
        zIndex: -10
    },
    message: {
        fontSize: normalizeWidth(25),
        color: Colors.white,
        marginLeft: 10,
        textTransform: 'capitalize',
        textAlign: 'center'
    },
    jar: {
        flex: 1,
        alignSelf: 'center',
        width: '100%',
        height: (() => {
            const height = normalizeHeight(1)
            if (height < 800) {
                return normalizeHeight(.9)
            }
            return normalizeHeight(1)
        })()
    },
    jarBallsContainer: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'flex-end',
        bottom: 0,
        width: '100%',
        paddingBottom: ballsPaddingBottom,
        height: (() => {
            const height = normalizeHeight(1)
            if (height < 800) {
                return normalizeHeight(.85)
            }
            return normalizeHeight(.98)
        })()
    },
    jarBalls: {
        flexDirection: 'row',
        flexWrap: 'wrap-reverse',
        maxHeight: '100%',
        overflow: 'hidden',
        alignSelf: 'center',
        width: '90%'
    },
    ball: {
        backgroundColor: Colors.primary,
        height: normalizeWidth(7),
        width: normalizeWidth(7),
        borderRadius: 100,
        padding: 10,
        alignContent: 'center',
        alignItems: 'center'
    },
    ballText: {
        fontSize: normalizeWidth(20),
        color: Colors.white
    },
    ballSubText: {
        fontSize: normalizeWidth(30),
        color: Colors.white
    },
})