import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Keyboard } from 'react-native';
import { AsapText } from '../components/StyledText';
import Colors from '../constants/Colors';
import EditReview from '../components/review/EditReview';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { addNewReview } from '../services/reviews/actions';
import { ReviewsActionsProps, ReviewProps } from '../services/reviews/types';
import { setBanner } from '../services/banner/actions';
import { BannerActionsProps } from '../services/banner/types';
import { ReducerStateProps } from '../services';
import { getDayName, getDate, getMonthShort } from '../utils/tools';
import { normalizeHeight } from '../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';


type ReviewScreenNavProp = StackNavigationProp<RootStackParamList, 'Review'>

interface ReviewComProps {
    navigation: ReviewScreenNavProp;
    addNewReview: ReviewsActionsProps['addNewReview'];
    setBanner: BannerActionsProps['setBanner'];
    reviews: ReviewProps[]
}


const Review = ({ navigation, addNewReview, setBanner, reviews }: ReviewComProps) => {
    const currentDate = new Date();
    const keyboardRef: any = useRef(new Animated.Value(0)).current


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <FontAwesome name="calendar" size={normalizeHeight(30)} color={Colors.white} style={{ marginRight: 10 }} onPress={navToHistory} />
            )
        })
    }, [])

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', (keyboard) => {
            Animated.spring(keyboardRef, {
                useNativeDriver: false,
                toValue: keyboard.endCoordinates.height
            }).start()
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
            Animated.spring(keyboardRef, {
                useNativeDriver: false,
                toValue: 0
            }).start()
        });

        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    }, [])

    const navToHistory = () => navigation.navigate('ReviewHistory');

    const handleAddNewReview = (review: ReviewProps) => {
        addNewReview(review)
            .then(() => {
                navigation.navigate('ReviewHistory')
            })
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerDate}>
                        <AsapText style={styles.headerDateDay}>{currentDate.getDate()}</AsapText>
                        <View>
                            <AsapText style={styles.headerDateMonYr}>{getDayName(currentDate)}</AsapText>
                            <AsapText style={styles.headerDateMonYr}>{getMonthShort(currentDate)} {currentDate.getFullYear()}</AsapText>
                        </View>
                    </View>
                    <AsapText style={styles.headerTitle}>Review</AsapText>
                </View>
                {reviews.findIndex(review => getDate(review.createdAt) === getDate(currentDate)) < 0 ?
                    <ScrollView style={styles.review}>
                        <EditReview edit={true} onSubmitReview={handleAddNewReview} setBanner={setBanner} />
                    </ScrollView> :
                    <View style={styles.doneContainer}>
                        <AsapText style={styles.doneText}>Today's Review Already Completed.</AsapText>
                    </View>
                }
                <Animated.View style={{ height: keyboardRef, width: '100%' }} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: normalizeHeight(20)
    },
    doneContainer: {
        flex: 1,
        alignItems: 'center',
    },
    doneText: {
        fontSize: 20,
        color: Colors.white
    },
    header: {
        alignSelf: 'center',
        marginBottom: 20
    },
    headerDate: {
        flexDirection: 'row',
        alignItems: 'center',
        left: 5
    },
    headerDateDay: {
        fontSize: normalizeHeight(25),
        color: Colors.white,
        marginRight: 10
    },
    headerDateMonYr: {
        fontSize: normalizeHeight(65),
        color: Colors.white
    },
    headerTitle: {
        fontSize: normalizeHeight(15),
        color: Colors.white,
        top: -10
    },
    review: {
        flex: 1,
        zIndex: 100
    }
})

const mapStateToProps = (state: ReducerStateProps) => ({
    reviews: state.reviews.reviews
})

export default connect(mapStateToProps, { addNewReview, setBanner })(Review);

