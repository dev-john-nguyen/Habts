import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, Linking } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';
import Database from '../../constants/Database';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import Colors from '../../constants/Colors';
import { AsapText, AsapTextBold } from '../../components/StyledText';
import { UserActionsProps } from '../../services/user/types';

const privacyUrl = 'https://habt-b0f23.web.app/privacy';
const termsUrl = 'https://habt-b0f23.web.app/terms';

export default ({ subscriptionPurchased }: { subscriptionPurchased: UserActionsProps['subscriptionPurchased'] }) => {
    const [loading, setLoading] = useState({
        com: true,
        month: false,
        free: false
    })
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(0);
    const mount = useRef(false);

    useEffect(() => {
        mount.current = true;

        InAppPurchases.getProductsAsync([Database.monthlyPurchaseId])
            .then(() => mount.current && setLoading({ ...loading, com: false }))
            .catch((err) => {
                // console.log(err)
                // if (mount.current) {
                //     setLoading({ ...loading, com: false });
                //     setError('Error occured while fetching products. Please try again.')
                // }
            })

        return () => {
            mount.current = false;
        }
    }, [refresh])

    const purchaseMonthly = () => {
        if (loading.month) return;
        setLoading({ ...loading, month: true })
        InAppPurchases.purchaseItemAsync(Database.monthlyPurchaseId)
            .then(() => setLoading({ ...loading, month: false }))
            .catch(() => setLoading({ ...loading, month: false }))

    }

    const handleRefresh = () => setRefresh(refresh + 1);

    const continueForFree = () => {
        setLoading({ ...loading, free: true })
        subscriptionPurchased(Database.oneMonthFreeTrail, new Date().getTime(), new Date().toISOString())
            .then(() => {
                setLoading({ ...loading, free: false })
            })
            .catch((err) => {
                console.log(err)
                setLoading({ ...loading, free: false })
            })
    }

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

    if (error) {
        return (
            <View style={styles.container}>
                <AsapText style={styles.error}>Error Occured. Please try again.</AsapText>
                <Pressable onPress={handleRefresh} style={styles.buttons}>
                    <AsapText style={styles.buttonText}>Refresh</AsapText>
                </Pressable>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <AsapText style={styles.smallText}>Your subscription has expired.</AsapText>
            <AsapTextBold style={styles.largeText}>Subscribe for unlimited access.</AsapTextBold>
            <AsapText style={styles.mediumText}>Unlock access to our habit tracker, reminders, notes, scheduling, and reflection tools.</AsapText>
            <Pressable onPress={purchaseMonthly} style={styles.buttons}>
                <AsapText style={styles.buttonText}>{loading.month ? <ActivityIndicator size='small' color={Colors.white} /> : 'Subscribe for $1.99 / Month'}</AsapText>
            </Pressable>
            <AsapText style={styles.smallText}>Become the best version of yourself.</AsapText>
            <AsapText style={styles.info}><AsapTextBold style={styles.docs} onPress={openTermsUrl}>Terms of Use</AsapTextBold> and <AsapTextBold style={styles.docs} onPress={openPrivacyUrl}>Privacy Policy.</AsapTextBold></AsapText>
            <AsapText style={styles.info}>If you are unable to access the app after purchase, please try to close and open the app again.</AsapText>

            {/* <Pressable onPress={continueForFree} style={styles.buttons}>
                <AsapText style={styles.buttonText}>{loading.free ? <ActivityIndicator size='small' color={Colors.white} /> : 'Continue for free'}</AsapText>
            </Pressable> */}
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        width: normalizeWidth(1),
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        paddingTop: normalizeHeight(15),
        paddingBottom: normalizeHeight(25)
    },
    docs: {
        fontSize: normalizeWidth(30),
        color: Colors.white,
        textDecorationLine: 'underline'
    },
    error: {
        fontSize: normalizeWidth(20),
        color: Colors.red,
        marginBottom: 10
    },
    headerContainer: {
        width: '100%',
        borderBottomColor: Colors.tertiary,
        borderBottomWidth: 1,
        alignItems: 'center',
        marginBottom: 10
    },
    smallText: {
        fontSize: normalizeWidth(30),
        width: '80%',
        textAlign: 'center',
        color: Colors.white,
        marginBottom: 10
    },
    mediumText: {
        fontSize: normalizeWidth(27),
        width: '80%',
        textAlign: 'center',
        color: Colors.white,
        marginBottom: 10
    },
    largeText: {
        fontSize: normalizeWidth(15),
        width: '100%',
        textAlign: 'center',
        color: Colors.white,
        marginBottom: 10
    },
    info: {
        fontSize: normalizeWidth(35),
        textAlign: 'center',
        color: Colors.white,
        width: '80%',
        marginBottom: 10
    },
    buttons: {
        margin: 10,
        alignSelf: 'stretch',
        padding: 20,
        backgroundColor: Colors.secondary,
        borderRadius: 20,
        alignItems: 'center'
    },
    buttonText: {
        color: Colors.white,
        fontSize: normalizeWidth(25),
    }
})

