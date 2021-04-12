import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AsapText } from '../../components/StyledText';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';

type SettingsNavProps = StackNavigationProp<RootStackParamList, 'Settings'>;


export default ({ navigation }: { navigation: SettingsNavProps }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <FontAwesome name="gear" size={40} color={Colors.white} />
                <AsapText style={styles.headerText}>Settings</AsapText> */}
            </View>
            <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('Account')}>
                <View style={styles.item}>
                    <Entypo name="user" size={24} color={Colors.white} />
                    <AsapText style={styles.itemText}>Account</AsapText>
                </View>
                <Entypo name="chevron-right" size={24} color={Colors.white} style={styles.chevron} />
            </Pressable>

            <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('Privacy')}>
                <View style={styles.item}>
                    <Entypo name="lock" size={24} color={Colors.white} />
                    <AsapText style={styles.itemText}>Privacy</AsapText>
                </View>
                <Entypo name="chevron-right" size={24} color={Colors.white} style={styles.chevron} />
            </Pressable>

            <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('Subscription')}>
                <View style={styles.item}>
                    <Entypo name="wallet" size={24} color={Colors.white} />
                    <AsapText style={styles.itemText}>Subscription</AsapText>
                </View>
                <Entypo name="chevron-right" size={24} color={Colors.white} style={styles.chevron} />
            </Pressable>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: .3,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    headerText: {
        fontSize: 30,
        color: Colors.white,
        marginLeft: 5
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
        fontSize: 16,
        flex: 1,
        marginLeft: 20,
        color: Colors.white
    },
    chevron: {
        position: 'absolute',
        right: 10,
    }
})

