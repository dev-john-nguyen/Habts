import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, PanResponder, ImageBackground, Easing, PanResponderGestureState, GestureResponderEvent } from 'react-native';
import { AsapText } from './StyledText';
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { cloneDeep } from 'lodash'
import { Entypo } from '@expo/vector-icons';
import { CompletedHabitsProps } from '../services/habits/types';
import { getDate, getMonthShort } from '../utils/tools';
import Layout from '../constants/Layout';
import { normalizeHeight } from '../utils/styles';


//notes: will need to update server/redux every time a user drops a ball into the container!
//only allow one drop per day
//have a message indicating the accomplishment

interface DropBallJarProps {
    completedHabits: CompletedHabitsProps[];
    setScrollEnabled: (value: boolean) => void;
    handleAddCompletedHabit: () => void;
    activeDay: number;
}

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

        const remainder = balls.length % 4

        let ballToPositionX = 0;
        let ballToPositionY = ((jarYOffSet.current + jarHeight.current) - (jarBallsHeight.current + 40)) //the 40 accounts for the padding bottom

        const jarBallsHalfWidth = (jarBallsWidth.current / 1.90) - (ballWidth.current / 1.2);

        switch (remainder) {
            case 0:
                ballToPositionX = -jarBallsHalfWidth;
                ballToPositionY = ballToPositionY - (ballHeight.current - 1);
                break;
            case 1:
                ballToPositionX = -(jarBallsHalfWidth / 3);
                break;
            case 2:
                ballToPositionX = (jarBallsHalfWidth / 3);
                break;
            case 3:
                ballToPositionX = jarBallsHalfWidth;
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

    const addBall = () => { handleAddCompletedHabit() }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.ballContainer, { zIndex: ballZIndex }]}>
                {
                    !completed && <Animated.View
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
                        />
                    </Animated.View>
                }
                <View style={styles.messageContainer}>
                    {quotes.current.thumb && <Entypo name="thumbs-up" size={normalizeHeight(30)} color={Colors.primary} />}
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
                                <View style={[styles.jarBall]} key={index}>
                                    <AsapText style={styles.ballText}>{item.dateCompleted.getDate()}</AsapText>
                                    <AsapText style={styles.ballSubText}>{getMonthShort(item.dateCompleted)} {item.dateCompleted.getFullYear()}</AsapText>
                                    <LinearGradient
                                        colors={[`rgba(255,255,255,.6)`, Colors.primary]}
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
    ballGlare: {
        position: 'absolute',
        right: 5,
        top: 10,
        width: 25,
        height: 10,
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
        fontSize: normalizeHeight(50),
        color: Colors.black,
        marginLeft: 10,
        textTransform: 'capitalize',
        textAlign: 'center'
    },
    ball: {
        backgroundColor: Colors.white,
        borderRadius: 100,
        alignSelf: 'center',
        alignItems: 'center',
        height: Layout.window.width / 15,
        width: Layout.window.width / 15,
    },
    ballText: {
        fontSize: normalizeHeight(35),
        color: Colors.white
    },
    ballSubText: {
        fontSize: normalizeHeight(80),
        color: Colors.white
    },
    jar: {
        flex: 1,
        alignSelf: 'center',
        width: '100%',
        height: Layout.window.height / 1.5
    },
    jarBallsContainer: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'flex-end',
        bottom: 0,
        width: '100%',
        paddingBottom: 40,
        height: Layout.window.height / 1.4
    },
    jarBalls: {
        flexDirection: 'row',
        flexWrap: 'wrap-reverse',
        paddingLeft: 20,
        maxHeight: '100%',
        overflow: 'hidden',
        alignSelf: 'center',
        width: '94%'
    },
    jarBall: {
        backgroundColor: Colors.primary,
        borderRadius: 100,
        padding: 20,
        marginLeft: 5,
        alignItems: 'center'
    }
})