import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { normalizeWidth } from '../../../../utils/styles';
import { StyledTextMedium } from '../../../StyledText';
import Colors from '../../../../constants/Colors';
import AlertCircle from '../../../../assets/svgs/AlertCircle';

const AnimatedCircle = Animated.createAnimatedComponent(AlertCircle)

interface Props {
    dateString: string;
    handleAddCompletedHabit: (prevDay: boolean) => void;
}

const WarningActionItem = ({ dateString, handleAddCompletedHabit }: Props) => {
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
                mount.current && handleAddCompletedHabit(true);
                mount.current && endAnimation();
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

    const onPressed = () => setIsPressed(isPressed ? false : true)

    return (
        <Pressable onPress={onPressed}>
            <Animated.View style={[styles.container, {
                transform: [
                    { translateX: posX },
                    { translateY: posY }
                ]
            }]}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.dateContainer, {}]}>
                        <StyledTextMedium style={styles.date}>
                            {dateString}
                        </StyledTextMedium>
                    </View>
                    <View style={styles.missCountContainer} />
                </View>
                <View style={styles.iconContainer}>
                    <View style={styles.circleSquare}>
                        <AnimatedCircle
                            fillColor={color.interpolate({
                                inputRange: [0, 1],
                                outputRange: [Colors.orange, Colors.green]
                            })}
                            strokeColor={Colors.white}
                            strokeOutlineColor={color.interpolate({
                                inputRange: [0, 1],
                                outputRange: [Colors.orange, Colors.green]
                            })} />
                    </View>
                </View>
            </Animated.View>
        </Pressable>
    )

}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: Colors.white,
        width: normalizeWidth(8),
        height: normalizeWidth(8),
        borderColor: Colors.orange
    },
    dateContainer: {
        flex: 1,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.orange
    },
    iconContainer: {
        flex: .9,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    date: {
        fontSize: normalizeWidth(45),
        textAlign: 'center',
        flexWrap: 'nowrap',
        color: Colors.white
    },
    circleSquare: {
        flex: 1
    },
    missCountContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .8
    }
})

export default WarningActionItem;