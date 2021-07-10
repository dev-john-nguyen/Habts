import React, { useState, useRef, useEffect } from 'react';
import { Animated, Pressable } from 'react-native';
import CircleSquare from '../../../assets/svgs/CircleSquare';
import Colors from '../../../constants/Colors';
import AlertCircle from '../../../assets/svgs/AlertCircle';


const AnimatedCircle = Animated.createAnimatedComponent(CircleSquare);
const AnimatedAlert = Animated.createAnimatedComponent(AlertCircle);

interface Props {
    handleAddCompletedHabit: () => void;
    isWarning?: boolean;
}

const PreviewActionItem = ({ handleAddCompletedHabit, isWarning }: Props) => {
    const [isPressed, setIsPressed] = useState(false);
    const posX = useRef(new Animated.Value(0)).current;
    const posY = useRef(new Animated.Value(0)).current;
    const color = useRef(new Animated.Value(0)).current;
    const mount = useRef(false);

    useEffect(() => {
        mount.current = true;
        let timeOut: NodeJS.Timeout | undefined;
        if (isPressed) {
            startAnimation();
            timeOut = setTimeout(() => {
                mount.current && handleAddCompletedHabit();
            }, 1000)
        } else {
            endAnimation()
            if (timeOut) {
                clearTimeout(timeOut)
            }
        }

        return () => {
            if (timeOut) clearTimeout(timeOut)
            mount.current = false;
        }
    }, [isPressed])

    const startAnimation = () => {
        Animated.loop(
            Animated.parallel([
                Animated.timing(posX, {
                    useNativeDriver: false,
                    toValue: 1,
                    duration: 200
                }),
                Animated.timing(posY, {
                    useNativeDriver: false,
                    toValue: 1,
                    duration: 200
                })
            ])
        ).start()
        Animated.timing(color, {
            useNativeDriver: false,
            toValue: 1,
            duration: 1000
        }).start()
    }

    const endAnimation = () => {
        posY.stopAnimation()
        posX.stopAnimation()
        color.stopAnimation()
        Animated.parallel([
            Animated.timing(posX, {
                useNativeDriver: false,
                toValue: 0,
                duration: 200
            }),
            Animated.timing(posY, {
                useNativeDriver: false,
                toValue: 0,
                duration: 200
            }),
            Animated.timing(color, {
                useNativeDriver: false,
                toValue: 0,
                duration: 1000
            })
        ]).start()
    }

    const onPressed = () => setIsPressed(true)

    const onOfPressed = () => setIsPressed(false)

    if (isWarning) {
        return (
            <Pressable onPressIn={onPressed} onPressOut={onOfPressed} style={{ flex: 1 }}>
                <Animated.View style={[{
                    transform: [{ translateX: posX }, { translateY: posY }
                    ],
                    flex: 1
                }]}>
                    <AnimatedAlert fillColor={color.interpolate({
                        inputRange: [0, 1],
                        outputRange: [Colors.orange, Colors.green]
                    })}
                        strokeColor={Colors.white}
                        strokeOutlineColor={color.interpolate({
                            inputRange: [0, 1],
                            outputRange: [Colors.orange, Colors.green]
                        })}
                    />
                </Animated.View>
            </Pressable >
        )
    }

    return (
        <Pressable onPressIn={onPressed} onPressOut={onOfPressed} style={{ flex: 1 }}>
            <Animated.View style={[{
                transform: [{ translateX: posX }, { translateY: posY }
                ],
                flex: 1
            }]}>
                <AnimatedCircle circleColor={color.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Colors.primary, Colors.green]
                })} squareColor={Colors.white} />
            </Animated.View>
        </Pressable >
    )
}

export default PreviewActionItem;