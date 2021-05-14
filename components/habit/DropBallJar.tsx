import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, PanResponder, ImageBackground, Easing } from 'react-native';
import { AsapText, AsapTextBold } from '../StyledText';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { cloneDeep } from 'lodash'
import { Entypo } from '@expo/vector-icons';
import { CompletedHabitsProps } from '../../services/habits/types';
import { getDate, getMonthShort } from '../../utils/tools';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import Ball from './Ball';


//notes: will need to update server/redux every time a user drops a ball into the container!
//only allow one drop per day
//have a message indicating the accomplishment

interface DropBallJarProps {
    completedHabits: CompletedHabitsProps[];
    setScrollEnabled: (value: boolean) => void;
    handleAddCompletedHabit: () => void;
    activeDay: number;
    resetBalls: number;
}

const ballsPaddingBottom = normalizeHeight(15);
const calcJarHeight = (() => {
    const height = normalizeHeight(1)
    if (height < 800) {
        return normalizeHeight(.9)
    }
    return normalizeHeight(1)
})()

export default ({ setScrollEnabled, completedHabits, handleAddCompletedHabit, activeDay, resetBalls }: DropBallJarProps) => {
    const currentDate = new Date();
    const [balls, setBalls] = useState<CompletedHabitsProps[]>([]);
    const [innerJarHeight, setInnerJarHeight] = useState<number>(calcJarHeight);
    const [completed, setCompleted] = useState(false);
    const [enableBall, setEnableBall] = useState(false);
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
    const quotes = useRef({ thumb: false, quote: 'One day at a time!' });

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
                //get reminder and determine what amount to splice
                handleSpliceBalls(balls);
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

    }, [resetBalls])

    useEffect(() => {
        setEnableBall(false);
        setInnerJarHeight(calcJarHeight);

        let timer;

        if (completedHabits.length >= 60) {
            timer = 6000;
        } else if (completedHabits.length < 6) {
            timer = 2000;
        } else if (completedHabits.length < 12) {
            timer = 3000;
        } else {
            timer = completedHabits.length * 150
        }

        setTimeout(() => {
            setInnerJarHeight(0);
            setEnableBall(true);
        }, timer)

    }, [resetBalls])

    const handleSpliceBalls = (newBalls: CompletedHabitsProps[]) => {
        const reminderBalls = newBalls.length % 6;
        switch (reminderBalls) {
            case 0:
                setBalls([...newBalls.splice((newBalls.length - 60), 60)])
                break;
            case 1:
                setBalls([...newBalls.splice((newBalls.length - 61), 61)])
                break;
            case 2:
                setBalls([...newBalls.splice((newBalls.length - 62), 62)])
                break;
            case 3:
                setBalls([...newBalls.splice((newBalls.length - 63), 63)])
                break;
            case 4:
                setBalls([...newBalls.splice((newBalls.length - 64), 64)])
                break;
            case 5:
                setBalls([...newBalls.splice((newBalls.length - 65), 65)])
                break;
            default:
                setBalls([...newBalls.splice((newBalls.length - 60), 60)])
        }
    }

    const addBall = () => handleAddCompletedHabit()

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.ballContainer, { zIndex: ballZIndex }]}>
                {
                    !completed && enableBall && <Animated.View
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
                    <AsapText style={styles.message}>{!enableBall ? 'filling container' : quotes.current.quote}</AsapText>
                    {quotes.current.thumb && <Entypo name="thumbs-up" size={normalizeHeight(20)} color={Colors.white} />}
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
                    source={require('../../assets/svgs/jar.png')}
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
                            transform: [{ translateY: jarBallsTransformY }],
                            height: innerJarHeight ? innerJarHeight : undefined
                        }}>
                            {balls.length > 0 && balls.map((item, index) => (
                                <Ball key={index} index={index} jarHeight={styles.jar.height} dateCompleted={item.dateCompleted} resetBalls={resetBalls} />
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
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
        top: -50,
        marginLeft: 10,
        padding: 20,
        zIndex: -10
    },
    message: {
        fontSize: normalizeHeight(50),
        color: Colors.white,
        marginLeft: 10,
        marginBottom: 20,
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