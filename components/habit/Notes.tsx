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
            <Feather name="arrow-left" size={normalizeWidth(20)} color={Colors.black} style={styles.x} onPress={onClose} />
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
        flex: 1,
        zIndex: 100,
        padding: 20,
    },
    content: {
        paddingBottom: 20
    },
    text: {
        color: Colors.primary,
        fontSize: normalizeHeight(50),
        margin: 20
    },
    header: {
        color: Colors.primary,
        fontSize: normalizeHeight(40),
        alignSelf: 'center',
        marginBottom: 5,
        marginTop: 10
    },
    x: {
        alignSelf: 'flex-start',
        position: 'absolute'
    },
    textInput: {
        fontSize: normalizeHeight(60),
        maxHeight: normalizeHeight(2),
        color: Colors.primary,
        margin: 20
    }
})

export default Notes;

