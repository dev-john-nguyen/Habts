import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AsapText, LatoText } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import { StyledPrimaryButton } from '../../components/StyledButton';
import { normalizeHeight } from '../../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.section}>
                    <AsapText style={styles.headerText}>Current Subscription</AsapText>
                    <LatoText style={styles.text}>Monthly: $0.99</LatoText>
                </View>

                <View style={styles.section}>
                    <AsapText style={styles.headerText}>Update Subscription</AsapText>
                    <LatoText style={styles.text}>Upgrade to Yearly Subscription at $10.</LatoText>
                    <StyledPrimaryButton
                        style={styles.button}
                        text='Pay Yearly'
                    />
                </View>

                <View style={styles.section}>
                    <AsapText style={styles.headerText}>Cancel Subscription</AsapText>
                    <LatoText style={styles.text}>Monthly: $0.99</LatoText>
                    <StyledPrimaryButton
                        style={styles.button}
                        text='Cancel'
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },
    section: {
        margin: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        color: Colors.white
    },
    text: {
        fontSize: 14,
        color: Colors.white,
        margin: 20
    },
    button: {
        alignSelf: 'stretch'
    }
})

