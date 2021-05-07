import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AsapText, LatoText } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalizeHeight } from '../../utils/styles';
import { ScrollView } from 'react-native-gesture-handler';

export default () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <AsapText style={styles.headerText}>Private Policy</AsapText>
                <ScrollView style={styles.section}>
                    <LatoText style={styles.subText}>Your privacy is our top priority. Your privacy is at the core of the way we design and build the services and products you know and love so that you can fully trust them and focus on yourself.</LatoText>
                    <LatoText style={styles.subText}>When you use our services, of course with your consent, we collect basic information to identify your device, including a device ID, and time zones. We also collect information about your activity on our services, for instance how you use them (e.g., date and time you logged in). We collect your email upon account creation. We collect the information that you provide when directly using our service.</LatoText>
                    <LatoText style={styles.subText}>We collect information from the habits you create, including time, name, and device ID, to allow us to send reminders to your device. Some habit data is stored on your phone for your privacy, such as the notes and the completed dates you create for the habits.</LatoText>
                    <LatoText style={styles.subText}>For reviews, we collect your device ID and your account creation date to help us calculate and identify when we should notify you of your next review. The reviews that you complete are stored on your phone for your privacy.</LatoText>
                    <LatoText style={styles.subText}>We strictly use the information collected to administer your account and provide services to you, including using the information to improve our services.</LatoText>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },
    section: {
        margin: 10
    },
    headerText: {
        fontSize: normalizeHeight(30),
        margin: 10,
        textAlign: 'center',
        color: Colors.white
    },
    subText: {
        fontSize: normalizeHeight(50),
        textAlign: 'left',
        margin: 10,
        color: Colors.white
    },
    input: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.primary,
        fontSize: 12,
        padding: 10,
        paddingTop: 10,
        color: Colors.white,
        margin: 10
    },
    button: {
        margin: 10
    }
})
