import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AsapText, LatoText } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalizeHeight } from '../../utils/styles';

export default () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.section}>
                    <AsapText style={styles.headerText}>Private Policy</AsapText>
                    <LatoText style={styles.subText}>Your privacy is a top priority. Your privacy is at the core of the way we design and build the services and products you know and love so that you can fully trust them and focus on yourself.</LatoText>
                    <LatoText style={styles.subText}>When you use our services, of course with your consent, we collect basic information to identify your device, including a device ID, and time zones. We also collect information about your activity on our services, for instance how you use them (e.g., date and time you logged in). We collect your email upon account creation. We collect the information that you provide when directly using our service.</LatoText>
                    <LatoText style={styles.subText}>We strictly use the information collected to administer your account and provide services to you, including using the information to improve our services.</LatoText>
                </View>
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
        fontSize: 25,
        margin: 10,
        textAlign: 'center',
        color: Colors.white
    },
    subText: {
        fontSize: 14,
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
