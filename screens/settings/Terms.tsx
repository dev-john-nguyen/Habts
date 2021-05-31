import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AsapText, LatoText, AsapTextBold } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalizeHeight } from '../../utils/styles';
import { ScrollView } from 'react-native-gesture-handler';

export default () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <AsapText style={styles.header}>Terms of Use</AsapText>
                <ScrollView style={styles.section}>

                    <AsapTextBold style={styles.topicText}>Acceptance of Terms of Use Agreement</AsapTextBold>
                    <LatoText style={styles.subText}>By creating an account you agree to be bound by our Terms of Use and Privacy Policy, each of which is incorporated by reference into this agreement. If you do not accept and agree to be bound by all of the terms of this agreement, you should not use the Service.
	We may make changes to this Agreement and the Service from time to time. We may do this for a variety of reasons including to reflect changes in or requirements of the law, new features, or changes in business practices.</LatoText>
                    <AsapTextBold style={styles.topicText}>Privacy Policy</AsapTextBold>
                    <LatoText style={styles.subText}>We care about data privacy and security. Please review our Privacy Policy. By using the application, you agree to be bound by our Privacy Policy, which is incorporated into these Terms of Use.</LatoText>

                    <AsapTextBold style={styles.topicText}>Your Account</AsapTextBold>
                    <LatoText style={styles.subText}>
                        You are responsible for maintaining the confidentiality of the login credentials you use to sign up for this service, and you are solely responsible for all activities that occur under those credentials. If you think your account has been compromised, please immediately contact us.
                </LatoText>

                    <AsapTextBold style={styles.topicText}>Payment</AsapTextBold>
                    <LatoText style={styles.subText}>
                        It is optional to pay our monthly subscription to use our services. If you choose to opt-in for our monthly subscription to support the Owner, your payment will be handled through your Apple account. Therefore, we reserve the right to refuse any request for a refund. You may contact Apple Team for any refund.
                </LatoText>

                    <AsapTextBold style={styles.topicText}>You Agree To:</AsapTextBold>

                    <LatoText style={styles.subText}>1. NOT use the application for any illegal or unauthorized purposes.</LatoText>
                    <LatoText style={styles.subText}>2. NOT use the application that will violate any applicable law or regulation.</LatoText>
                    <LatoText style={styles.subText}>3. NOT to make systemic requests to our servers.</LatoText>
                    <LatoText style={styles.subText}>4. NOT to engage in unauthorized framing of or linking to the application.</LatoText>
                    <LatoText style={styles.subText}>5. Use the application with good intentions and for the sole purpose of what the service is intended to be used for.</LatoText>
                    <LatoText style={styles.subText}>You may not access or use the application for any purpose other than that for which we make the application available. We reserve the right to suspend your account if you believe our service is being improperly used.</LatoText>


                    <AsapTextBold style={styles.topicText}>User Data</AsapTextBold>
                    <LatoText style={styles.subText}>We will maintain certain data that you transmit to the application to manage the performance of the application, as well as data relating to your use of the application. You are responsible for all application that you transmit or that relates to any activity you have undertaken using the application. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.</LatoText>

                    <AsapTextBold style={styles.topicText}>Account Termination</AsapTextBold>
                    <LatoText style={styles.subText}>These Terms commence on the date you accept them and continue until terminated following the terms herein.
                    If you do not accept these terms, you can terminate your account by notifying us at any time or you can personally close your account through the app.
	We may terminate or suspend these Terms If you violate these terms, or if we are required to do so by law.</LatoText>

                    <AsapTextBold style={styles.topicText}>Additional</AsapTextBold>
                    <LatoText style={styles.subText}>We reserve the right to modify, amend, or change the Terms at any time. The effective date of the updates will be posted at the bottom of the terms.</LatoText>


                    <AsapTextBold style={styles.topicText}>Contact Us</AsapTextBold>
                    <LatoText style={styles.subText}>Please contact us at softlete@gmail.com</LatoText>

                    <LatoText style={styles.subText}>updated on 05/21/2021</LatoText>

                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center'
    },
    section: {
        backgroundColor: Colors.white,
        borderRadius: 10
    },
    header: {
        fontSize: normalizeHeight(30),
        margin: 10,
        textAlign: 'center',
        color: Colors.white
    },
    topicText: {
        fontSize: normalizeHeight(40),
        textAlign: 'left',
        margin: 10,
        color: Colors.primary
    },
    subText: {
        fontSize: normalizeHeight(50),
        textAlign: 'left',
        margin: 10,
        color: Colors.primary
    }
})
