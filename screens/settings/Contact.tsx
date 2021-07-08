import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AsapText, AsapTextBold, AsapTextMedium } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';

const ContactUs = () => {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <AsapTextBold style={styles.header}>Contact Us</AsapTextBold>
                <View style={styles.underline} />
                <AsapText style={styles.text}>Feel free to contact us with any questions, concerns, or advice about this app. We would love to hear from you.</AsapText>
                <View style={styles.section}>
                    <AsapTextBold style={styles.itemHeaderText}>Email</AsapTextBold>
                    <AsapText style={styles.text}>softlete@gmail.com</AsapText>
                    <AsapTextBold style={styles.itemHeaderText}>Website</AsapTextBold>
                    <AsapText style={styles.text}>habt-b0f23.web.app</AsapText>
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
    header: {
        fontSize: normalizeHeight(20),
        color: Colors.primary,
    },
    section: {
    },
    itemHeaderText: {
        fontSize: normalizeHeight(50),
        color: Colors.primary,
        marginTop: 10
    },
    text: {
        fontSize: normalizeHeight(60),
        color: Colors.primary,
    }
})

export default ContactUs;

