import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { AsapText, AsapTextBold } from '../StyledText';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import Colors from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { StyledTextInput } from '../StyledTextInput';
import { ScrollView } from 'react-native-gesture-handler';
import Inputs from '../../constants/Inputs';

interface Props {
    notes: string;
    onClose: () => void;
    edit: boolean;
    updateNotes: (notes: string) => void;
    editNotes: string;
}

const Notes = ({ notes, onClose, edit, updateNotes, editNotes }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <AsapTextBold style={styles.header}>Notes</AsapTextBold>
                <Pressable style={styles.x} onPress={onClose} hitSlop={5}>
                    <Feather name="x" size={normalizeWidth(20)} color={Colors.primary} onPress={onClose} />
                </Pressable>
            </View>
            {edit ?
                <StyledTextInput
                    style={styles.textInput}
                    value={editNotes}
                    onChangeText={updateNotes}
                    autoCorrect={true}
                    multiline={true}
                    maxLength={Inputs.habitNotesMaxChar}
                />
                : <ScrollView contentContainerStyle={styles.content}>
                    <AsapText style={styles.text}>{notes}</AsapText>
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        zIndex: 100,
        padding: 10,
        backgroundColor: Colors.contentBg,
        borderRadius: 10,
        height: normalizeHeight(3)
    },
    content: {
        paddingBottom: 10
    },
    text: {
        color: Colors.primary,
        fontSize: normalizeHeight(55),
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    header: {
        color: Colors.primary,
        fontSize: normalizeHeight(40),
        alignSelf: 'center',
        marginBottom: 5,
        marginTop: 10
    },
    x: {
    },
    textInput: {
        fontSize: normalizeHeight(55),
        color: Colors.primary,
        borderRadius: 10,
        backgroundColor: Colors.white,
        padding: 10,
        paddingTop: 10,
        height: '80%'
    }
})

export default Notes;

