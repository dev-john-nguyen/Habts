import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AsapText, LatoText, AsapTextBold, AsapTextMedium } from '../../components/StyledText';
import { StyledPrimaryButton, StyledRedButton } from '../../components/StyledButton';
import { firebaseDb, firestoreDb } from '../../firebase';
import { StyledTextInput } from '../../components/StyledTextInput';
import Colors from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Entypo } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { signOut } from '../../services/user/actions';
import { connect } from 'react-redux';
import { UserActionsProps } from '../../services/user/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import Database from '../../constants/Database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SIGN_OUT } from '../../services/user/actionTypes';


function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

type AccountNavProps = StackNavigationProp<RootStackParamList, 'Account'>;

interface Props {
    navigation: AccountNavProps;
    signOut: UserActionsProps['signOut'];
    signOutUser: () => void;
}

const Account = ({ navigation, signOut, signOutUser }: Props) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const mount = useRef(false)

    useEffect(() => {
        mount.current = true

        navigation.setOptions({
            headerRight: () => (
                <Entypo name="log-out" size={24} color={Colors.red} onPress={signOut} style={{ marginRight: 10 }} />
            )
        })

        return () => {
            mount.current = false;
        }
    }, [])

    const sendPasswordResetEmail = () => {
        if (!email) return;
        if (!validateEmail(email)) return alert('Invalid email. Please try again.');
        setLoading(true)
        firebaseDb.auth().sendPasswordResetEmail(email)
            .then(() => {
                alert('A email was sent to your email address. Please follow the directions in the email to reset your password.');
                setLoading(false)
            })
            .catch((error) => {
                switch (error.code) {
                    case 'auth/invalid-email':
                    case 'auth/user-not-found':
                        alert('The email you provided was incorrect. Please try again.');
                        break;
                    default:
                        alert('A unexpected error occurred. Please try again.');
                }
                setLoading(false)
            })
    }

    const handleConfirm = () => {
        Alert.alert(
            "Remove My Account",
            "Are You Sure?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: handleOnDeleteAccount }
            ]
        );
    }

    const handleOnDeleteAccount = async () => {
        setDeleteLoading(true)

        const { currentUser } = firebaseDb.auth();

        if (currentUser) {
            try {
                await firestoreDb.collection(Database.Users).doc(currentUser.uid).delete()
                await AsyncStorage.removeItem(Database.currentUser)
                await currentUser.delete();
                signOutUser()
            } catch (err) {
                console.log(err)
                alert('We are having trouble removing your account. Please try to sign out and then sign back in.')
            }
        } else {
            alert('Please sign out and sign back in to remove account.')
        }

        mount.current && setDeleteLoading(false)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <AsapTextBold style={styles.header}>Account</AsapTextBold>
                <View style={styles.underline} />
                <View>
                    <AsapTextMedium style={styles.sectionHeaderText}>Notification</AsapTextMedium>
                    <LatoText style={styles.subText}>You can update your notification settings by navigating to your settings on your phone.</LatoText>
                    <LatoText style={styles.subText}>If you want to turn off/on a notification for a habit, navigate to the habit, tap the edit icon (pencil icon) located in the top right corner, and tap the notification icon (bell icon) to turn off/on.</LatoText>
                </View>
                <View style={styles.section}>
                    <AsapTextMedium style={styles.sectionHeaderText}>Password</AsapTextMedium>
                    <AsapText style={styles.subText}>Send Email To Reset Password</AsapText>
                    <StyledTextInput
                        style={styles.input}
                        placeholder='Confirm Email Address'
                        textContentType='emailAddress'
                        autoCapitalize={"none"}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <StyledPrimaryButton text={loading ? <ActivityIndicator color={Colors.white} size='small' /> : 'Send'} style={styles.button} onPress={sendPasswordResetEmail} />
                </View>
                <View style={styles.section}>
                    <AsapTextMedium style={styles.sectionHeaderText}>Delete Account</AsapTextMedium>
                    <StyledRedButton text={deleteLoading ? <ActivityIndicator color={Colors.white} size='small' /> : 'Remove'} style={styles.button} onPress={handleConfirm} />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: normalizeWidth(15),
        paddingTop: normalizeHeight(25),
    },
    underline: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.contentBg,
        marginTop: 5,
        marginBottom: 5
    },
    content: {
        padding: 20,
        backgroundColor: Colors.white,
        alignSelf: 'center',
        margin: 5,
        borderRadius: 10
    },
    header: {
        fontSize: normalizeHeight(20),
        color: Colors.primary,
    },
    section: {
        marginTop: 20
    },
    sectionHeaderText: {
        fontSize: normalizeHeight(50),
        color: Colors.primary,
        marginBottom: 1
    },
    subText: {
        fontSize: normalizeHeight(60),
        color: Colors.primary,
        marginBottom: 1
    },
    input: {
        borderRadius: 20,
        fontSize: normalizeWidth(25),
        padding: 10,
        paddingTop: 10,
        color: Colors.primary,
        backgroundColor: Colors.white,
        marginTop: 10
    },
    button: {
        marginTop: 10
    }
})

export default connect(null, { signOut, signOutUser })(Account);

function signOutUser() {
    return {
        type: SIGN_OUT
    }
}