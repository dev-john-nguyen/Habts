import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AsapText, AsapTextBold } from '../StyledText';
import { normalizeHeight, normalizeWidth } from '../../utils/styles';
import Colors from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { StyledTextInput } from '../StyledTextInput';
import { charLimitNotes } from '../../screens/utils';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
    notes: string;
    onClose: () => void;
    edit: boolean;
    updateNotes: (notes: string) => void;
    editNotes: string;
}

const Notes = ({ notes, onClose, edit, updateNotes, editNotes }: Props) => {

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Feather name="x" size={normalizeWidth(20)} color={Colors.white} style={styles.x} onPress={onClose} />
            <AsapTextBold style={styles.header}>Notes</AsapTextBold>
            {edit ?

                <StyledTextInput
                    style={styles.textInput}
                    value={editNotes}
                    onChangeText={updateNotes}
                    autoCorrect={true}
                    multiline={true}
                    maxLength={charLimitNotes}
                /> :
                <AsapText style={styles.text}>{notes}</AsapText>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: normalizeHeight(5),
        maxHeight: normalizeHeight(2),
        width: normalizeWidth(1.1),
        alignSelf: 'center',
        backgroundColor: Colors.primary,
        zIndex: 100,
        padding: 20,
        borderRadius: 20
    },
    content: {

    },
    text: {
        color: Colors.white,
        fontSize: normalizeHeight(50)
    },
    header: {
        color: Colors.white,
        fontSize: normalizeHeight(40),
        alignSelf: 'center',
        marginBottom: 10
    },
    x: {
        alignSelf: 'flex-end'
    },
    textInput: {
        fontSize: normalizeHeight(60),
        maxHeight: normalizeHeight(2),
        color: Colors.white,
    }
})

export default Notes;

