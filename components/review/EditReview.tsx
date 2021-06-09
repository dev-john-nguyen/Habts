import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { AsapText, LatoText } from '../StyledText';
import Colors from '../../constants/Colors';
import StarRating from '../StarRating';
import { StyledTextInput } from '../StyledTextInput';
import { StyledPrimaryButton } from '../StyledButton';
import { ReviewProps } from '../../services/reviews/types';
import { BannerActionsProps } from '../../services/banner/types';
import { normalizeHeight } from '../../utils/styles';
import Inputs from '../../constants/Inputs';

interface ComponentProps {
    edit: boolean;
    review?: ReviewProps;
    onSubmitReview: (item: ReviewProps) => void;
    setBanner: BannerActionsProps['setBanner']
}

export default ({ edit, review, onSubmitReview, setBanner }: ComponentProps) => {
    const emptyReviewItem = {
        docId: '',
        createdAt: new Date(),
        rating: 0,
        good: '',
        bad: '',
        learn: '',
        notificationOn: true
    }

    const [item, setItem] = useState<ReviewProps>(emptyReviewItem);

    useEffect(() => {
        if (review) {
            setItem({ ...review })
        }
    }, [review])

    const handleSubmit = () => {
        let key: keyof ReviewProps;
        for (key in item) {
            if (key !== 'docId' && !item[key]) {
                return setBanner("error", "Please make sure all the fields are filled out.")
            }
        }

        onSubmitReview(item);
    }

    return (
        <View style={styles.container}>
            <View style={[styles.questionContainer, Colors.boxShadowLight]}>
                <AsapText style={styles.questionText}>Out of 5, how do you feel about your habits since your last review?</AsapText>
                <StarRating setStarRating={(number) => setItem({ ...item, rating: number })} starRating={item.rating} edit={edit} />
            </View>

            <View style={[styles.questionContainer, Colors.boxShadowLight]}>
                <AsapText style={styles.questionText}>What Went Well?</AsapText>
                {edit ? <StyledTextInput
                    value={item.good}
                    onChangeText={(text) => setItem({ ...item, good: text })}
                    style={[styles.answerInput, Colors.boxShadowLight]}
                    placeholder="I'm on a 20 day meditation streak ..."
                    autoCorrect={true}
                    multiline={true}
                    maxLength={Inputs.reviewInputMaxChar}
                    onSubmitEditing={Keyboard.dismiss}
                /> : <View style={styles.textContainer}>
                        <LatoText style={styles.text}>
                            {item.good}
                        </LatoText>
                    </View>
                }
            </View>

            <View style={[styles.questionContainer, Colors.boxShadowLight]}>
                <AsapText style={styles.questionText}>What Didn't Go So Well?</AsapText>
                {edit ? <StyledTextInput
                    value={item.bad}
                    onChangeText={(text) => setItem({ ...item, bad: text })}
                    style={[styles.answerInput, Colors.boxShadowLight]}
                    placeholder="It's hard to maintain consistency in the gym ..."
                    autoCorrect={true}
                    multiline={true}
                    maxLength={Inputs.reviewInputMaxChar}
                    onSubmitEditing={Keyboard.dismiss}
                /> : <View style={styles.textContainer}>
                        <LatoText style={styles.text}>
                            {item.bad}
                        </LatoText>
                    </View>
                }
            </View>

            <View style={[styles.questionContainer, Colors.boxShadowLight]}>
                <AsapText style={styles.questionText}>What Did I Learn?</AsapText>
                {edit ? <StyledTextInput
                    value={item.learn}
                    onChangeText={(text) => setItem({ ...item, learn: text })}
                    style={[styles.answerInput, Colors.boxShadowLight]}
                    placeholder='I learned how disciplined i am ...'
                    autoCorrect={true}
                    multiline={true}
                    onSubmitEditing={Keyboard.dismiss}
                    maxLength={Inputs.reviewInputMaxChar}
                /> : <View style={styles.textContainer}>
                        <LatoText style={styles.text}>
                            {item.learn}
                        </LatoText>
                    </View>
                }
            </View>

            {edit && <StyledPrimaryButton text='Save' onPress={handleSubmit} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
    },
    textContainer: {
        borderRadius: 5,
        backgroundColor: Colors.white,
        minHeight: 200
    },
    text: {
        fontSize: normalizeHeight(60),
        color: Colors.primary,
        padding: 10,
    },
    questionContainer: {
        marginBottom: 50
    },
    questionText: {
        fontSize: normalizeHeight(40),
        textTransform: 'capitalize',
        color: Colors.white,
        marginBottom: 20
    },
    answerInput: {
        borderRadius: 5,
        minHeight: 200,
        fontSize: normalizeHeight(60),
        padding: 10,
        paddingTop: 10,
        color: Colors.primary,
        backgroundColor: Colors.white
    }
})