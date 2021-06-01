import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { AsapText, AsapTextBold } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import { connect } from 'react-redux';
import { ReducerStateProps } from '../../services';
import { UserProps } from '../../services/user/types';
import { DateTime } from 'luxon';
import { normalizeHeight } from '../../utils/styles';
import Database from '../../constants/Database';

const Subscription = ({ user }: { user: UserProps }) => {

    const expiredAt = DateTime.fromJSDate(new Date(user.expiredAt));

    let expired = false

    if (expiredAt) {
        const utcNow = DateTime.utc();
        const luxExpiredAt = DateTime.fromJSDate(user.expiredAt).toUTC();
        if (utcNow > luxExpiredAt) {
            expired = true
        }
    }

    let subscription: any = {}

    switch (user.subscription) {
        case Database.monthlyPurchaseId:
            subscription = {
                name: 'Habts - All Access - Monthly',
                price: '$1.99 / Month',
                description: 'Your subscription will auto renewal monthly until you decide to unsubscribe. You can update your subscription at any time by going to your settings in the iTunes store. Thank you for subscribing :).'
            }
            break;
        case Database.oneMonthFreeTrail:
        default:
            subscription = {
                name: '1 Month Free Trail',
                price: '$0.00 / Month',
                description: `You are currently on the one month free trail. Free trail expires on ${expiredAt.toISODate()}.`
            }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <AsapText style={styles.header}>Subscription</AsapText>
                <View style={styles.content}>
                    <View style={styles.section}>
                        {expired && <AsapTextBold style={[styles.headerText, { color: Colors.red, fontSize: normalizeHeight(40) }]}>Your subscription has expired</AsapTextBold>}
                        <AsapText style={styles.headerText}>Name:</AsapText>
                        <AsapTextBold style={styles.headerText}>{subscription.name}</AsapTextBold>
                        <AsapText style={styles.headerText}>Price:</AsapText>
                        <AsapTextBold style={styles.headerText}>{subscription.price}</AsapTextBold>
                        <AsapText style={styles.headerText}>Description:</AsapText>
                        <AsapTextBold style={styles.headerText}>{subscription.description}</AsapTextBold>
                        <AsapText style={styles.headerText}>Access:</AsapText>
                        <AsapTextBold style={styles.headerText}>With this subscription, you have unlimited access to this service until your subscription expires.</AsapTextBold>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const mapStateToProps = (state: ReducerStateProps) => ({
    user: state.user
})

export default connect(mapStateToProps, {})(Subscription);




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
        fontSize: normalizeHeight(50),
        color: Colors.black,
        padding: 10
    },
    text: {
        fontSize: normalizeHeight(35),
        color: Colors.black,
        margin: 10
    },
    button: {
        alignSelf: 'stretch'
    }
})

