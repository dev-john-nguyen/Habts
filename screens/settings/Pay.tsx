import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, Linking } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';
import Database from '../../constants/Database';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import Colors from '../../constants/Colors';
import { StyledText, StyledTextBold, StyledTextMedium } from '../../components/StyledText';
import { UserActionsProps } from '../../services/user/types';
import HeaderBgImg from '../../assets/svgs/home/HeaderBgImg';

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
                console.log(err)
                if (mount.current) {
                    setLoading({ ...loading, com: false });
                    setError('An error occured. Please try again.')
                }
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

    return (
        <>
            <View style={styles.headerBgContainer}>
                <HeaderBgImg />
            </View>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'space-evenly'
                    }}>
                        <StyledTextBold style={styles.headerText}>Habts</StyledTextBold>
                        <StyledTextMedium style={styles.headerSubText}>Lets continue to pursue your unknown potential.</StyledTextMedium>
                    </View>
                    <View style={{ flex: 1 }}>
                    </View>
                </View>


                <View style={{ flex: 1 }}>
                    <View style={[styles.content, Colors.boxShadow]}>
                        <StyledText style={styles.smallText}>Your subscription has expired.</StyledText>
                        <StyledTextBold style={styles.largeText}>Subscribe for unlimited access</StyledTextBold>
                        <View style={styles.underline} />
                        <StyledText style={styles.mediumText}>Unlock access to our habit tracker, reminders, notes, and scheduling.</StyledText>
                        <Pressable onPress={purchaseMonthly} style={styles.buttons}>
                            <StyledTextBold style={styles.buttonText}>{loading.month ? <ActivityIndicator size='small' color={Colors.white} /> : 'Subscribe for $1.99 / Month'}</StyledTextBold>
                        </Pressable>
                        <StyledText style={styles.error}>
                            {error}
                        </StyledText>
                        <Pressable onPress={continueForFree} style={styles.buttons}>
                            <StyledText style={styles.buttonText}>{loading.free ? <ActivityIndicator size='small' color={Colors.white} /> : 'Continue for free'}</StyledText>
                        </Pressable>
                    </View>
                </View>
                <View style={{ flex: .3 }}>
                    <StyledText style={styles.info}><StyledTextBold style={styles.docs} onPress={openTermsUrl}>Terms of Use</StyledTextBold> and <StyledTextBold style={styles.docs} onPress={openPrivacyUrl}>Privacy Policy.</StyledTextBold></StyledText>
                    <StyledText style={styles.info}>If you are unable to access the app after purchase, please try to close and open the app again.</StyledText>
                </View>
            </View >
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1
    },
    headerContainer: {
        flex: .5,
    },
    ovalContainer: {
        width: '90%',
        height: normalizeHeight(50)
    },
    headerSubText: {
        fontSize: normalizeHeight(50),
        color: Colors.white
    },
    headerText: {
        fontSize: normalizeHeight(12),
        color: Colors.white
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 20,
        width: '90%',
        borderRadius: 10,
        alignSelf: 'center',
        flex: .9
    },
    headerBgContainer: {
        position: 'absolute', width: '100%', height: '60%', top: '-5%', zIndex: -100
    },
    underline: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.secondary,
        marginTop: 10,
        marginBottom: 10
    },
    docs: {
        fontSize: normalizeWidth(30),
        color: Colors.secondary
    },
    error: {
        fontSize: normalizeWidth(40),
        color: Colors.red,
    },
    smallText: {
        fontSize: normalizeWidth(30),
        width: '100%',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 5
    },
    mediumText: {
        fontSize: normalizeWidth(27),
        width: '100%',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 10
    },
    largeText: {
        fontSize: normalizeWidth(15),
        textAlign: 'center',
        width: '100%',
        color: Colors.primary,
        textTransform: 'capitalize'
    },
    info: {
        fontSize: normalizeWidth(35),
        textAlign: 'center',
        color: Colors.primary,
        width: '100%',
        marginBottom: 10
    },
    buttons: {
        alignSelf: 'stretch',
        padding: 20,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    buttonText: {
        color: Colors.white,
        fontSize: normalizeWidth(25),
    }
})

