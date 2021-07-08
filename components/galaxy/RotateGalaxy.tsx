import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View, Easing, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import { StyledText } from '../StyledText';
import { CompletedHabitsProps } from '../../services/habits/types';
import Stars from './Stars';
import SmallStars from '../Stars';
import { normalizeWidth } from '../../utils/styles';
import { loginWords } from '../utils';

interface Props {
    balls: CompletedHabitsProps[];
    login?: boolean;
}
export default ({ balls, login }: Props) => {
    const rotateAdmin = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(Animated.sequence([
            Animated.timing(rotateAdmin, {
                useNativeDriver: false,
                toValue: 2,
                duration: 10000,
                easing: Easing.linear
            })
        ])).start()
    }, [])

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[`rgba(${Colors.primaryRgb},.5)`, `rgba(${Colors.whiteRgb},.5)`, `rgba(${Colors.secondaryRgb},.5)`]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBorder} />
            <View style={styles.container}>
                <Animated.View
                    style={[{
                        transform: [{ rotateX: '45deg' }, { rotateY: '20deg' }, { perspective: 500 }, {
                            rotateZ: rotateAdmin.interpolate({
                                inputRange: [0, 1, 2],
                                outputRange: ['0deg', '180deg', '360deg']
                            })
                        }]
                    }, styles.rotateContainer]}
                >
                    <LinearGradient
                        style={styles.gradientGalaxy}
                        colors={[Colors.primary, `rgba(${Colors.secondaryRgb},.6)`]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <SmallStars quantity={20} topMax={normalizeWidth(1)} rightMax={normalizeWidth(1)} />
                        {login ? loginWords.map((word, index) => (
                            <Stars key={index.toString()} text={word} index={index} login={true} />
                        ))
                            : balls.length > 0 && balls.map((item, index) => (
                                <Stars key={index.toString()} text={`${item.dateCompleted.getMonth()}/${item.dateCompleted.getDate()}`} index={index} />
                            ))}
                    </LinearGradient>
                </Animated.View>
                <View style={[styles.centerStar, { backgroundColor: login ? Colors.primary : Colors.yellow }]}>
                    {login ? <Image source={require('../../assets/logo.png')} style={{ height: '100%', width: '100%', borderRadius: 20 }} />
                        : <View style={styles.centerStar}>
                            <StyledText style={styles.centerStartText}>{balls.length}</StyledText>
                        </View>}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    gradientBorder: {
        position: 'absolute',
        height: normalizeWidth(1),
        width: normalizeWidth(1),
        borderRadius: normalizeWidth(2),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1000,
        transform: [{ rotateX: '45deg' }, { rotateY: '20deg' }]
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
    centerStar: {
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: normalizeWidth(10),
        width: normalizeWidth(10),
        zIndex: 0,
        borderRadius: 100
    },
    centerStartText: {
        color: Colors.primary,
        fontSize: normalizeWidth(22)
    },
})