import React from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import { AsapText } from '../../components/StyledText';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { normalizeHeight } from '../../utils/styles';

type SettingsNavProps = StackNavigationProp<RootStackParamList, 'Settings'>;

const privacyUrl = 'https://habt-b0f23.web.app/privacy';
const termsUrl = 'https://habt-b0f23.web.app/terms';


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

    return (
        <View style={styles.container}>
            <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('Account')}>
                <View style={styles.item}>
                    <Entypo name="user" size={normalizeHeight(40)} color={Colors.white} />
                    <AsapText style={styles.itemText}>Account</AsapText>
                </View>
                <Entypo name="chevron-right" size={normalizeHeight(40)} color={Colors.white} style={styles.chevron} />
            </Pressable>

            <Pressable style={styles.itemContainer} onPress={openPrivacyUrl}>
                <View style={styles.item}>
                    <Entypo name="lock" size={normalizeHeight(40)} color={Colors.white} />
                    <AsapText style={styles.itemText}>Privacy Policy</AsapText>
                </View>
                <Entypo name="chevron-right" size={normalizeHeight(40)} color={Colors.white} style={styles.chevron} />
            </Pressable>


            <Pressable style={styles.itemContainer} onPress={openTermsUrl}>
                <View style={styles.item}>
                    <FontAwesome name="file-text" size={normalizeHeight(40)} color={Colors.white} />
                    <AsapText style={styles.itemText}>Terms of Use</AsapText>
                </View>
                <Entypo name="chevron-right" size={normalizeHeight(40)} color={Colors.white} style={styles.chevron} />
            </Pressable>

            <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('Subscription')}>
                <View style={styles.item}>
                    <Entypo name="wallet" size={normalizeHeight(40)} color={Colors.white} />
                    <AsapText style={styles.itemText}>Subscription</AsapText>
                </View>
                <Entypo name="chevron-right" size={normalizeHeight(40)} color={Colors.white} style={styles.chevron} />
            </Pressable>

            <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('ContactUs')}>
                <View style={styles.item}>
                    <Entypo name="phone" size={normalizeHeight(40)} color={Colors.white} />
                    <AsapText style={styles.itemText}>Contact</AsapText>
                </View>
                <Entypo name="chevron-right" size={normalizeHeight(40)} color={Colors.white} style={styles.chevron} />
            </Pressable>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    itemContainer: {
        width: '100%',
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    item: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        width: '50%'
    },
    itemText: {
        fontSize: normalizeHeight(50),
        flex: 1,
        marginLeft: 20,
        color: Colors.white
    },
    chevron: {
        position: 'absolute',
        right: 10,
    }
})

