import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';
import Database from '../../constants/Database';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import Colors from '../../constants/Colors';
import { AsapText, AsapTextBold } from '../../components/StyledText';
import { UserActionsProps } from '../../services/user/types';

export default ({ subscriptionPurchased, onDirectToTerms }: { subscriptionPurchased: UserActionsProps['subscriptionPurchased'], onDirectToTerms: () => void }) => {
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
                    setError('Error occured while fetching products. Please try again.')
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
            <AsapTextBold style={styles.header}>Subscription Expired</AsapTextBold>
            <AsapText style={styles.subHeader}>Please consider subscribing to support my efforts, but it's optional. Thanks 😁</AsapText>
            <AsapText style={styles.info}>By continuing, you agree to our <AsapTextBold style={styles.info} onPress={onDirectToTerms}>Terms of Use</AsapTextBold></AsapText>
            <AsapText style={styles.info}>If you are unable to access the app after purchase, please try to close and open the app again.</AsapText>
            <Pressable onPress={purchaseMonthly} style={styles.buttons}>
                <AsapText style={styles.buttonText}>{loading.month ? <ActivityIndicator size='small' color={Colors.white} /> : 'Monthly @ $1.99'}</AsapText>
            </Pressable>


            <Pressable onPress={continueForFree} style={styles.buttons}>
                <AsapText style={styles.buttonText}>{loading.free ? <ActivityIndicator size='small' color={Colors.white} /> : 'Continue for free'}</AsapText>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        height: normalizeHeight(2),
        width: normalizeWidth(1),
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        paddingTop: 50
    },
    error: {
        fontSize: normalizeWidth(20),
        color: Colors.red,
        marginBottom: 10
    },
    header: {
        fontSize: normalizeWidth(15),
        color: Colors.white,
        marginBottom: 10,
    },
    subHeader: {
        fontSize: normalizeWidth(25),
        width: '80%',
        textAlign: 'center',
        color: Colors.white,
        marginBottom: 10
    },
    info: {
        fontSize: normalizeWidth(35),
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

