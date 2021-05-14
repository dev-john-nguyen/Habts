import React from 'react';
import { StyleSheet } from 'react-native';
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
        <ScrollView style={[styles.container]} contentContainerStyle={styles.content}>
            <Feather name="x" size={normalizeWidth(20)} color={Colors.black} style={styles.x} onPress={onClose} />
            <AsapTextBold style={styles.header}>Notes</AsapTextBold>
            {edit ?

                <StyledTextInput
                    style={styles.textInput}
                    value={editNotes}
                    onChangeText={updateNotes}
                    autoCorrect={true}
                    multiline={true}
                    maxLength={Inputs.habitNotesMaxChar}
                /> :
                <AsapText style={styles.text}>{notes}</AsapText>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: normalizeHeight(9),
        maxHeight: normalizeHeight(2),
        width: normalizeWidth(1.1),
        alignSelf: 'center',
        backgroundColor: Colors.veryLightGrey,
        zIndex: 100,
        padding: 20,
        borderRadius: 20,
        borderColor: Colors.primary,
        borderWidth: 1
    },
    content: {

    },
    text: {
        color: Colors.primary,
        fontSize: normalizeHeight(50)
    },
    header: {
        color: Colors.primary,
        fontSize: normalizeHeight(40),
        alignSelf: 'center',
        marginBottom: 5,
        marginTop: 10
    },
    x: {
        alignSelf: 'flex-end',
        position: 'absolute'
    },
    textInput: {
        fontSize: normalizeHeight(60),
        maxHeight: normalizeHeight(2),
        color: Colors.primary,
    }
})

export default Notes;

