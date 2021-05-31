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
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <AsapText style={styles.header}>Subscription</AsapText>
                <View style={styles.content}>
                    <View style={styles.section}>
                        <AsapText style={styles.headerText}>Subscription Type:</AsapText>
                        <AsapTextBold style={styles.text}>{subscriptionType()}</AsapTextBold>
                    </View>

                    <View style={styles.section}>
                        <AsapText style={styles.headerText}>Subscription Expiration Date (will update on renewal date):</AsapText>
                        <AsapTextBold style={styles.text}>{expiredAt.toFormat('LLL dd yyyy')}</AsapTextBold>
                    </View>

                    <View style={styles.section}>
                        <AsapText style={styles.headerText}>You can manage your subscription in your account settings on the App Store.</AsapText>
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
        margin: 20
    },
    button: {
        alignSelf: 'stretch'
    }
})

