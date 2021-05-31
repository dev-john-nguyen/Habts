import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AsapText, AsapTextBold } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import { normalizeHeight } from '../../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';

const ContactUs = () => {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <AsapText style={styles.header}>Contact Us</AsapText>
                <View style={styles.content}>
                    <View style={styles.section}>
                        <AsapText style={styles.headerText}>Feel free to contact us with any questions, concerns, or advice about this app. We would love to hear from you.</AsapText>
                    </View>
                    <View style={styles.section}>
                        <AsapText style={styles.headerText}>You can reach us @</AsapText>
                        <AsapTextBold style={styles.text}>softlete@gmail.com</AsapTextBold>
                        <AsapText style={styles.headerText}>Our our website @</AsapText>
                        <AsapTextBold style={styles.text}>habt-b0f23.web.app</AsapTextBold>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        margin: 5,
        backgroundColor: Colors.white,
        borderRadius: 10
    },
    header: {
        fontSize: normalizeHeight(30),
        margin: 10,
        textAlign: 'center',
        color: Colors.white
    },
    section: {
        marginBottom: normalizeHeight(40),
        alignItems: 'center',
    },
    headerText: {
        textAlign: 'center',
        fontSize: normalizeHeight(50),
        color: Colors.black,
        padding: 20
    },
    text: {
        fontSize: normalizeHeight(35),
        color: Colors.black,
        margin: 20
    },
    button: {
        alignSelf: 'stretch'
    }
})

export default ContactUs;

