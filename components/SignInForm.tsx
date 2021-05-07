import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Image, Keyboard, ActivityIndicator } from 'react-native';
import { StyledTextInput } from './StyledTextInput';
import Colors from '../constants/Colors';
import { UserActionsProps } from '../services/user/types';
import { StyledPrimaryButton, StyledSecondaryButton } from './StyledButton';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Superman from '../assets/svgs/superman';
import { isEqual } from 'lodash';
import { validateEmail } from './utils';
import { BannerActionsProps } from '../services/banner/types';
import { AsapTextBold } from './StyledText';
import BottomSvg from '../assets/svgs/bottom';

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
            <View style={styles.container}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <AsapTextBold style={styles.header}>"We are what we repeatedly do"</AsapTextBold>
                <AsapTextBold style={styles.subHeader}>Get 1 month for free when you sign up!</AsapTextBold>
                <StyledTextInput
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize='none'
                    autoCorrect={false}
                    textContentType='emailAddress'
                    placeholder='email'
                    style={styles.textInput}
                />

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

                {
                    showSignUp && <StyledTextInput
                        value={password2}
                        onChangeText={(text) => setPassword2(text)}
                        autoCorrect={false}
                        autoCapitalize='none'
                        secureTextEntry={true}
                        placeholder='confirm Password'
                        onSubmitEditing={Keyboard.dismiss}
                        style={styles.textInput}
                    />
                }
                <StyledPrimaryButton
                    text={loading ? <ActivityIndicator size='small' color={Colors.white} /> : 'Submit'}
                    style={styles.buttons}
                    onPress={handleOnSubmit}
                />
                <StyledSecondaryButton
                    text={showSignUp ? 'Login' : 'Sign Up'}
                    onPress={() => setShowSignUp(showSignUp ? false : true)}
                    style={styles.buttons}
                />
                <View style={styles.superman}>
                    <Superman />
                </View>
            </View>
            <View style={styles.bottomSvg}>
                <BottomSvg />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 20,
        padding: 20
    },
    header: {
        fontSize: normalizeWidth(10),
        marginTop: normalizeHeight(25),
        color: `rgba(${Colors.whiteRgb}, .8)`
    },
    subHeader: {
        fontSize: normalizeWidth(25),
        marginTop: normalizeHeight(40),
        marginBottom: normalizeHeight(30),
        color: `rgba(${Colors.whiteRgb}, .8)`
    },
    galaxy: {
        position: 'absolute',
        zIndex: -2,
        bottom: 10,
    },
    superman: {
        position: 'absolute',
        bottom: normalizeHeight(20),
        left: normalizeWidth(20),
        height: normalizeWidth(4),
        width: normalizeWidth(4),
        transform: [{ scaleX: -1 }, { rotate: '-45deg' }],
        zIndex: -10
    },
    buttons: {
        alignSelf: 'center',
        width: '50%',
        margin: 10
    },
    logo: {
        borderRadius: 20,
        height: normalizeHeight(10),
        width: normalizeHeight(10),
    },
    textInput: {
        width: '100%',
        borderColor: Colors.secondary,
        borderWidth: 2,
        borderRadius: 20,
        padding: 10,
        marginBottom: 20,
        fontSize: normalizeHeight(60),
        color: Colors.white
    },
    bottomSvg: {
        position: 'absolute',
        width: '100%',
        height: normalizeHeight(15),
        bottom: 0
    },
})