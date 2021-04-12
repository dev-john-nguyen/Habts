import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { ReducerStateProps } from '../services';
import Navigation from '../navigation';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { UserProps, UserActionsProps } from '../services/user/types';
import { removeBanner, setBanner } from '../services/banner/actions';
import { BannerActionsProps, BannerProps } from '../services/banner/types';
import Banner from '../components/Banner';
import { signUp, saveNotificationToken, signIn } from '../services/user/actions';
import SignInForm from '../components/SignInForm';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import Stars from '../components/Stars';
import Layout from '../constants/Layout';

interface MainProps {
    user: UserProps;
    banner: BannerProps;
    removeBanner: BannerActionsProps['removeBanner'];
    signUp: UserActionsProps['signUp'];
    setBanner: BannerActionsProps['setBanner'];
    saveNotificationToken: UserActionsProps['saveNotificationToken'];
    signIn: UserActionsProps['signIn'];
}

const Main = ({ user, banner, removeBanner, signUp, setBanner, saveNotificationToken, signIn }: MainProps) => {
    const colorScheme = useColorScheme();


    useEffect(() => {
        if (user.uid) {
            //ask notification;
            registerForPushNotificationsAsync()
                .catch((err) => {
                    console.log(err)
                    setBanner("error", "Failed to get push token for push notification!")
                })
        }
    }, [user.uid])

    async function registerForPushNotificationsAsync() {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                setBanner('warning', "Your notification is off.")
                return;
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            saveNotificationToken(token)
        } else {
            console.log('Must use physical device for Push Notifications');
        }

        // if (Platform.OS === 'android') {
        //     Notifications.setNotificationChannelAsync('default', {
        //         name: 'default',
        //         importance: Notifications.AndroidImportance.MAX,
        //         vibrationPattern: [0, 250, 250, 250],
        //         lightColor: '#FF231F7C',
        //     });
        // }
    }

    const renderContent = () => {
        if (!user.fetched) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size='large' color={Colors.primary} />
                </View>
            )
        }

        if (!!user.uid) {
            return <Navigation colorScheme={'light'} />

        }

        return <SignInForm signUp={signUp} signIn={signIn} setBanner={setBanner} />
    }

    return (
        <LinearGradient
            style={styles.container}
            colors={[Colors.primary, 'rgba(17, 81, 115, 0.5)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Stars quantity={30} rightMax={Layout.window.width} topMax={Layout.window.height} />
            {renderContent()}
            <Banner removeBanner={removeBanner} banner={banner} />
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
})

const mapStateToProps = (state: ReducerStateProps) => ({
    user: state.user,
    banner: state.banner
})

export default connect(mapStateToProps, { removeBanner, signUp, setBanner, saveNotificationToken, signIn })(Main)