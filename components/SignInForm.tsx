import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Keyboard, ActivityIndicator, Animated } from 'react-native';
import { StyledTextInput } from './StyledTextInput';
import Colors from '../constants/Colors';
import { UserActionsProps } from '../services/user/types';
import { StyledPrimaryButton, StyledSecondaryButton } from './StyledButton';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isEqual } from 'lodash';
import { validateEmail } from './utils';
import { BannerActionsProps } from '../services/banner/types';
import { AsapTextBold, AsapText, AsapTextMedium } from './StyledText';
import BottomSvg from '../assets/svgs/bottom';
import HeaderBgImg from '../assets/svgs/home/HeaderBgImg';
import HeaderImg from '../assets/svgs/home/HeaderImg';
import { FontAwesome } from '@expo/vector-icons';
import Oval from '../assets/svgs/home/Oval';

interface Props {
    setBanner: BannerActionsProps['setBanner'];
    signUp: UserActionsProps['signUp'];
    signIn: UserActionsProps['signIn'];
}

export default ({ signUp, signIn, setBanner }: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showSignUp, setShowSignUp] = useState(false);
    const [password2, setPassword2] = useState('');
    const [loading, setLoading] = useState(false);
    const isMount = useRef(false)
    const keyboardRef: any = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', (key) => {
            Animated.spring(keyboardRef, {
                useNativeDriver: false,
                toValue: key.endCoordinates.height / 2.1
            }).start()
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
            Animated.spring(keyboardRef, {
                useNativeDriver: false,
                toValue: 0
            }).start()
        });

        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    }, [])

    useEffect(() => {
        isMount.current = true;
        return () => {
            isMount.current = false;
        }
    }, [])

    const inValidateForm = () => {
        if (!email || !password) {
            return 'Enter your email and password.';
        }

        if (showSignUp && !isEqual(password, password2)) {
            return 'Passwords Do Not Match!';
        }

        if (!validateEmail(email)) {
            return 'Invalid Email';
        }

    }

    const handleOnSubmit = () => {
        const isInvalid = inValidateForm()
        if (isInvalid) {
            return setBanner("error", isInvalid)
        }
        if (showSignUp) {
            onSignUp()
        } else {
            onSignIn()
        }
    }

    const onSignIn = () => {
        setLoading(true)
        signIn(email, password)
            .then(() => {
                isMount.current && setLoading(false)
            })
            .catch(() => {
                isMount.current && setLoading(false)
            })
    }

    const onSignUp = () => {
        setLoading(true)
        signUp(email, password, password2)
            .then(() => {
                isMount.current && setLoading(false)
            })
            .catch((err) => {
                isMount.current && setLoading(false)
            })
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.headerBgContainer}>
                <HeaderBgImg />
            </View>
            <Animated.View style={[styles.container, { bottom: keyboardRef }]}>

                <View style={styles.headerContainer}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'space-evenly'
                    }}>
                        <View>
                            <AsapTextBold style={styles.headerText}>Habts</AsapTextBold>
                            <AsapTextMedium style={styles.headerSubText}>We are what we repeatedly do.</AsapTextMedium>
                        </View>
                        <View style={styles.ovalContainer}>
                            <Oval fillColor={Colors.secondary} />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <HeaderImg />
                    </View>
                </View>

                <View style={[styles.loginContainer, Colors.boxShadow]} >
                    <View style={styles.loginHeaderContainer}>
                        <AsapTextBold style={styles.loginHeaderText}>Login</AsapTextBold>
                        <AsapTextMedium style={styles.loginHeaderSubText}>One month free trail</AsapTextMedium>
                        <AsapTextMedium style={styles.loginHeaderSecSubText}>and then $1.99 / month to continue using our service.</AsapTextMedium>
                    </View>

                    <View style={styles.loginInputContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <StyledTextInput
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                autoCapitalize='none'
                                autoCorrect={false}
                                textContentType='emailAddress'
                                placeholder='email'
                                style={styles.textInput}
                            />
                            <FontAwesome name='envelope' size={normalizeHeight(60)} color={Colors.secondary} style={{
                                position: 'absolute',
                                right: normalizeWidth(40),
                            }} />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <StyledTextInput
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                autoCorrect={false}
                                autoCapitalize='none'
                                secureTextEntry={true}
                                placeholder='password'
                                onSubmitEditing={Keyboard.dismiss}
                                style={styles.textInput}
                            />
                            <FontAwesome name='lock' size={normalizeHeight(50)} color={Colors.secondary} style={{
                                position: 'absolute',
                                right: normalizeWidth(40),
                            }} />
                        </View>

                        {
                            showSignUp &&
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <StyledTextInput
                                    value={password2}
                                    onChangeText={(text) => setPassword2(text)}
                                    autoCorrect={false}
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    placeholder='confirm Password'
                                    onSubmitEditing={Keyboard.dismiss}
                                    style={styles.textInput}
                                />
                                <FontAwesome name='lock' size={normalizeHeight(50)} color={Colors.secondary} style={{
                                    position: 'absolute',
                                    right: normalizeWidth(40),
                                }} />
                            </View>
                        }

                    </View>

                    <View style={styles.loginButtonsContainer}>
                        <StyledPrimaryButton
                            text={loading ? <ActivityIndicator size='small' color={Colors.white} /> : showSignUp ? 'Register' : 'Login'}
                            style={styles.buttons}
                            onPress={handleOnSubmit}
                        />
                    </View>
                </View>

                <View style={styles.bottomSectionContainer}>
                    <AsapTextMedium style={styles.bottomSectionText}>{showSignUp ? "Have an account?" : "Don't have an account?"}</AsapTextMedium>
                    <StyledSecondaryButton
                        text={showSignUp ? 'Login' : 'Register'}
                        onPress={() => setShowSignUp(showSignUp ? false : true)}
                        style={styles.buttons}
                    />
                </View>
            </Animated.View>
            <View style={styles.bottomSvg}>
                <BottomSvg />
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 20
    },
    headerBgContainer: {
        position: 'absolute', width: '100%', height: '60%', top: '-5%', zIndex: -100
    },
    ovalContainer: {
        height: normalizeHeight(50),
        width: '100%',
    },
    headerContainer: {
        flexDirection: 'row',
        flex: .5,
        marginBottom: 20
    },
    headerSubText: {
        fontSize: normalizeHeight(60),
        color: Colors.white
    },
    headerText: {
        fontSize: normalizeHeight(20),
        color: Colors.white
    },
    loginContainer: {
        flex: .8,
        backgroundColor: Colors.contentBg,
        borderRadius: 10,
        padding: 20,
        margin: 20,
    },
    loginHeaderContainer: {
        flex: .5,
        justifyContent: 'space-evenly'
    },
    loginInputContainer: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    loginButtonsContainer: {
        flex: .5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginHeaderText: {
        color: Colors.primary,
        textAlign: 'center',
        fontSize: normalizeHeight(30)
    },
    loginHeaderSubText: {
        color: Colors.primary,
        fontSize: normalizeHeight(70),
    },
    loginHeaderSecSubText: {
        color: Colors.primary,
        fontSize: normalizeHeight(100)
    },
    bottomSectionContainer: {
        flex: .5, alignItems: 'center', justifyContent: 'center'
    },
    bottomSectionText: {
        fontSize: normalizeHeight(60),
        color: Colors.primary
    },
    buttons: {
        alignSelf: 'center',
        width: '50%',
        margin: 10,
    },
    textInput: {
        width: '100%',
        borderRadius: 20,
        padding: 10,
        fontSize: normalizeHeight(60),
        color: Colors.primary,
        backgroundColor: Colors.bgColor
    },
    bottomSvg: {
        position: 'absolute',
        width: '100%',
        height: normalizeHeight(15),
        bottom: 0
    },
})