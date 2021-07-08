import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { AsapText, AsapTextBold, AsapTextMedium } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import { connect } from 'react-redux';
import { ReducerStateProps } from '../../services';
import { UserProps } from '../../services/user/types';
import { DateTime } from 'luxon';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
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
                <AsapTextBold style={styles.header}>Subscription</AsapTextBold>
                <View style={styles.underline} />
                <View style={styles.content}>
                    <View style={styles.section}>
                        <AsapTextBold style={[styles.itemHeaderText, { marginTop: 0 }]}>Status</AsapTextBold>
                        <AsapText style={{ fontSize: normalizeHeight(60), color: expired ? Colors.red : Colors.primary }}>{expired ? 'Expired' : 'Active'}</AsapText>
                        <AsapTextBold style={styles.itemHeaderText}>Name</AsapTextBold>
                        <AsapText style={styles.text}>{subscription.name}</AsapText>
                        <AsapTextBold style={styles.itemHeaderText}>Price</AsapTextBold>
                        <AsapText style={styles.text}>{subscription.price}</AsapText>
                        <AsapTextBold style={styles.itemHeaderText}>Description</AsapTextBold>
                        <AsapText style={styles.text}>{subscription.description}</AsapText>
                        <AsapTextBold style={styles.itemHeaderText}>Access</AsapTextBold>
                        <AsapText style={styles.text}>With this subscription, you have ALL ACCESS to this app until your subscription expires.</AsapText>
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
    content: {
    },
    header: {
        fontSize: normalizeHeight(20),
        color: Colors.primary,
    },
    section: {
    },
    itemHeaderText: {
        fontSize: normalizeHeight(50),
        color: Colors.primary,
        marginTop: 10
    },
    text: {
        fontSize: normalizeHeight(60),
        color: Colors.primary,
    }
})

