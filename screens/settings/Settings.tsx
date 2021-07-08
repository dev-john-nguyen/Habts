import React from 'react';
import { View, StyleSheet, Pressable, Linking, SafeAreaView } from 'react-native';
import { StyledText, StyledTextBold, StyledTextMedium } from '../../components/StyledText';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import History from '../../assets/svgs/History';

type SettingsNavProps = StackNavigationProp<RootStackParamList, 'Settings'>;

const privacyUrl = 'https://habt-b0f23.web.app/privacy';
const termsUrl = 'https://habt-b0f23.web.app/terms';
const iconUrl = 'https://www.flaticon.com/authors/google'

export default ({ navigation }: { navigation: SettingsNavProps }) => {

    const openPrivacyUrl = async () => {
        const supported = await Linking.canOpenURL(privacyUrl);

        if (supported) {
            await Linking.openURL(privacyUrl)
        } else {
            alert('Not able to open this url')
        }
    }

    const openTermsUrl = async () => {
        const supported = await Linking.canOpenURL(termsUrl);

        if (supported) {
            await Linking.openURL(termsUrl)
        } else {
            alert('Not able to open this url')
        }
    }

    const openIconUrl = async () => {
        const supported = await Linking.canOpenURL(iconUrl);

        if (supported) {
            await Linking.openURL(iconUrl)
        } else {
            alert('Not able to open this url')
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>

                <StyledTextBold style={styles.header}>Settings</StyledTextBold>
                <View style={styles.underline} />
                <Pressable style={[styles.itemContainer, { marginTop: 10 }]} onPress={() => navigation.navigate('Account')}>
                    <View style={styles.item}>
                        <Entypo name="user" size={normalizeHeight(40)} color={Colors.white} />
                        <StyledTextBold style={styles.itemText}>Account</StyledTextBold>
                    </View>
                    <Entypo name="chevron-right" size={normalizeHeight(40)} color={Colors.white} style={styles.chevron} />
                </Pressable>

                <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('Subscription')}>
                    <View style={styles.item}>
                        <Entypo name="wallet" size={normalizeHeight(40)} color={Colors.white} />
                        <StyledTextBold style={styles.itemText}>Subscription</StyledTextBold>
                    </View>
                    <Entypo name="chevron-right" size={normalizeHeight(40)} color={Colors.white} style={styles.chevron} />
                </Pressable>

                <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('ContactUs')}>
                    <View style={styles.item}>
                        <Entypo name="phone" size={normalizeHeight(40)} color={Colors.white} />
                        <StyledTextBold style={styles.itemText}>Contact</StyledTextBold>
                    </View>
                    <Entypo name="chevron-right" size={normalizeHeight(40)} color={Colors.white} style={styles.chevron} />
                </Pressable>

                <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('HabitHistory')}>
                    <View style={styles.item}>
                        <View style={{ height: normalizeHeight(40), width: normalizeHeight(40) }}>
                            <History color={Colors.white} />
                        </View>
                        <StyledTextBold style={styles.itemText}>History</StyledTextBold>
                    </View>
                    <Entypo name="chevron-right" size={normalizeHeight(40)} color={Colors.white} style={styles.chevron} />
                </Pressable>

                <View style={{ marginTop: 10 }}>
                    <Pressable style={styles.linkContainer} onPress={openPrivacyUrl}>
                        <StyledTextMedium style={styles.linkText}>Privacy Policy</StyledTextMedium>
                    </Pressable>
                    <Pressable style={styles.linkContainer} onPress={openTermsUrl}>
                        <StyledTextMedium style={styles.linkText}>Terms of Use</StyledTextMedium>
                    </Pressable>
                </View>
                <Pressable style={styles.creditContainer} onPress={openIconUrl}>
                    <StyledText style={styles.creditText}>Icons made by <StyledTextBold style={styles.creditText}>Google</StyledTextBold> from www.flaticon.com</StyledText>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        color: Colors.primary
    },
    itemContainer: {
        width: '100%',
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 20,
        paddingLeft: 10,
        borderRadius: 20
    },
    linkContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    linkText: {
        color: Colors.primary,
        textDecorationLine: 'underline'
    },
    item: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        width: '50%'
    },
    itemText: {
        fontSize: normalizeWidth(30),
        flex: 1,
        marginLeft: 20,
        color: Colors.white
    },
    chevron: {
        position: 'absolute',
        right: 10,
    },
    creditContainer: {
        position: 'absolute',
        bottom: 0,
        left: normalizeWidth(10)
    },
    creditText: {
        fontSize: normalizeHeight(80),
        color: Colors.primary
    }
})

