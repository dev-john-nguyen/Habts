import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AsapText, AsapTextBold } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import { normalizeHeight } from '../../utils/styles';

const ContactUs = () => {

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <AsapText style={styles.headerText}>Feel free to contact us with any questions, concerns, or advice about this app. We would love to hear from you.</AsapText>
            </View>
            <View style={styles.section}>
                <AsapText style={styles.headerText}>You can reach us @</AsapText>
                <AsapTextBold style={styles.text}>softlete@gmail.com</AsapTextBold>
                <AsapText style={styles.headerText}>Our our website @</AsapText>
                <AsapTextBold style={styles.text}>softlete.com</AsapTextBold>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    section: {
        marginBottom: normalizeHeight(20),
        alignItems: 'center',
    },
    headerText: {
        textAlign: 'center',
        fontSize: normalizeHeight(40),
        color: Colors.white,
        padding: 20
    },
    text: {
        fontSize: normalizeHeight(35),
        color: Colors.white,
        margin: 20
    },
    button: {
        alignSelf: 'stretch'
    }
})

export default ContactUs;

