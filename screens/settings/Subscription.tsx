import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AsapText, AsapTextBold } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import { connect } from 'react-redux';
import { ReducerStateProps } from '../../services';
import { UserProps } from '../../services/user/types';
import { DateTime } from 'luxon';
import { normalizeWidth, normalizeHeight } from '../../utils/styles';
import Pay from './Pay';
import Database from '../../constants/Database';

const Subscription = ({ user }: { user: UserProps }) => {

    const expiredAt = DateTime.fromJSDate(new Date(user.expiredAt));

    const subscriptionType = () => {
        switch (user.subscription) {
            case Database.monthlyPurchaseId:
                return 'Monthly'
            case Database.oneMonthFreeTrail:
            default:
                return '1 Month Free Trail'
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <AsapText style={styles.headerText}>Subscription Type:</AsapText>
                <AsapTextBold style={styles.text}>{subscriptionType()}</AsapTextBold>
            </View>

            <View style={styles.section}>
                <AsapText style={styles.headerText}>Subscription Expiration Date:</AsapText>
                <AsapTextBold style={styles.text}>{expiredAt.toFormat('LLL dd yyyy')}</AsapTextBold>
            </View>

            <View style={styles.section}>
                <AsapText style={styles.headerText}>You can manage your subscription in your account settings on the App Store.</AsapText>
            </View>
        </View>
    )
}

const mapStateToProps = (state: ReducerStateProps) => ({
    user: state.user
})

export default connect(mapStateToProps, {})(Subscription);




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    section: {
        marginBottom: normalizeHeight(20),
        alignItems: 'center',
    },
    headerText: {
        fontSize: normalizeWidth(20),
        color: Colors.white,
        padding: 20
    },
    text: {
        fontSize: normalizeWidth(15),
        color: Colors.white,
        margin: 20
    },
    button: {
        alignSelf: 'stretch'
    }
})

