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
                <AsapText style={styles.header}>Private Policy</AsapText>
                <ScrollView style={styles.section}>
                    <AsapTextBold style={styles.topicText}>Data Collected</AsapTextBold>
                    <LatoText style={styles.subText}>This application collects, by itself or through third parties, cookies, usage data, unique device identifiers, and geographic position. Upon signing up, you provide an email and password in which we collect to solely use to identify you as a user. We also collect some information regarding what habits you create to service your reminders.</LatoText>
                    <AsapTextBold style={styles.topicText}>Accessing and Processing</AsapTextBold>
                    <LatoText style={styles.subText}>
                        We may process personal data related to the user if one of the following applies:
                </LatoText>


                    <LatoText style={styles.subText}>
                        1. Users have given their consent for one or more specific purposes.
                    </LatoText>

                    <LatoText style={styles.subText}>
                        2. provision of Data is necessary for the performance of an agreement with the User and/or for any pre-contractual obligations thereof;
                    </LatoText>

                    <LatoText style={styles.subText}>
                        3. processing is necessary for compliance with a legal obligation to which the Owner is subject;
                    </LatoText>

                    <LatoText style={styles.subText}>
                        4. processing is related to a task that is carried out in the public interest or the exercise of official authority vested in the Owner;
                    </LatoText>

                    <LatoText style={styles.subText}>
                        5. processing is necessary for the legitimate interests pursued by the Owner or by a third party.
                    </LatoText>







                    <LatoText style={styles.subText}>
                        Personal data shall be processed and stored for as long as the required purpose they have been collected for. Personal data is removed from storage upon deletion of their account or if directly told to do so by the user.
                </LatoText>
                    <LatoText style={styles.subText}>	We solely use the data collected to provide services or to improve our service.</LatoText>
                    <AsapTextBold style={styles.topicText}>Your Account</AsapTextBold>
                    <LatoText style={styles.subText}>	You are responsible for maintaining the confidentiality of the login credentials you use to sign up, and you are solely responsible for all activities that occur under those credentials. If you think your account has been compromised, please immediately contact us.</LatoText>
                    <AsapTextBold style={styles.topicText}>Push Notifications</AsapTextBold>
                    <LatoText style={styles.subText}>
                        We may provide you push notifications related to the App and our services, such as enhancements, events, and other promotions. After downloading the App, you will be asked to accept or deny push notifications. If you deny, you will not receive push notifications. If you accept, push notifications will automatically be sent to you. If you decide to opt out of push notifications, you can change the notification settings on your mobile device settings.
                </LatoText>
                    <AsapTextBold style={styles.topicText}>Your Rights</AsapTextBold>
                    <LatoText style={styles.subText}>Users may exercise certain rights regarding their Data processed.
In particular, Users have the right to do the following:</LatoText>

                    <LatoText style={styles.subText}>1. Withdraw their consent at any time. Users have the right to withdraw consent where they have previously given their consent to the processing of their Personal Data.</LatoText>
                    <LatoText style={styles.subText}>2. Object to processing of their Data. Users have the right to object to the processing of their Data if the processing is carried out on a legal basis other than consent.</LatoText>
                    <LatoText style={styles.subText}>3. Access their Data. Users have the right to learn if Data is being processed, obtain disclosure regarding certain aspects of the processing, and obtain a copy of the Data undergoing processing.</LatoText>
                    <LatoText style={styles.subText}>4. Verify and seek rectification. Users have the right to verify the accuracy of their Data and ask for it to be updated or corrected.</LatoText>
                    <LatoText style={styles.subText}>5. Have their Personal Data deleted or otherwise removed. Users have the right, under certain circumstances, to obtain the erasure of their Data from the Owner.</LatoText>
                    <LatoText style={styles.subText}>6. Lodge a complaint. Users have the right to bring a claim before their competent data protection authority.</LatoText>


                    <AsapTextBold style={styles.topicText}>Legal action</AsapTextBold>
                    <LatoText style={styles.subText}>	The User’s Personal Data may be used for legal purposes in Court or the stages leading to possible legal action arising from improper use of this Application or the related Services.
	The User declares to be aware that we may be required to reveal personal data upon request of public authorities.</LatoText>

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
