import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';
import Database from '../../constants/Database';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import Colors from '../../constants/Colors';
import { AsapText, AsapTextBold } from '../../components/StyledText';

export default () => {
    const [loading, setLoading] = useState({
        com: true,
        month: false,
        year: false
    })
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        InAppPurchases.getProductsAsync([Database.monthlyPurchaseId])
            .then(() => setLoading({ ...loading, com: false }))
            .catch((err) => {
                console.log(err)
                setLoading({ ...loading, com: false });
                setError('Error occured while fetching products. Please try again.')
            })
    }, [refresh])

    const purchaseMonthly = () => {
        if (loading.month) return;
        setLoading({ ...loading, month: true })
        InAppPurchases.purchaseItemAsync(Database.monthlyPurchaseId)
            .then(() => setLoading({ ...loading, month: false }))
            .catch(() => setLoading({ ...loading, month: false }))

    }
    const purchaseYearly = () => {
        if (loading.year) return;
        setLoading({ ...loading, year: true })
        InAppPurchases.purchaseItemAsync(Database.monthlyPurchaseId)
            .then(() => setLoading({ ...loading, year: false }))
            .catch(() => setLoading({ ...loading, year: false }))
    }

    const handleRefresh = () => setRefresh(refresh + 1);

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

    if (loading.com) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={Colors.white} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <AsapTextBold style={styles.header}>Subscription Expired</AsapTextBold>
            <AsapText style={styles.subHeader}>Please subscribe to one of the following. Thanks 😁</AsapText>
            <Pressable onPress={purchaseMonthly} style={styles.buttons}>
                <AsapText style={styles.buttonText}>{loading.month ? <ActivityIndicator size='small' color={Colors.white} /> : 'Monthly @ $1.99'}</AsapText>
            </Pressable>

            <Pressable onPress={purchaseYearly} style={styles.buttons}>
                <AsapText style={styles.buttonText}>{loading.year ? <ActivityIndicator size='small' color={Colors.white} /> : 'Yearly @ $10.99'}</AsapText>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        height: normalizeHeight(3),
        width: normalizeWidth(1),
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        paddingBottom: 20
    },
    error: {
        fontSize: normalizeWidth(20),
        color: Colors.red,
        marginBottom: 10
    },
    header: {
        fontSize: normalizeWidth(15),
        color: Colors.white,
        marginBottom: 5,
        marginTop: 10
    },
    subHeader: {
        fontSize: normalizeWidth(30),
        color: Colors.white,
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

