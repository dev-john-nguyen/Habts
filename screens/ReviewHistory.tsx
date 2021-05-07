import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Animated, Easing, Keyboard } from 'react-native';
import { AsapText } from '../components/StyledText';
import Colors from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { getDayName, getDate, getMonthShort } from '../utils/tools';
import { ReviewProps, ReviewsActionsProps } from '../services/reviews/types';
import { connect } from 'react-redux';
import { ReducerStateProps } from '../services';
import EditReview from '../components/review/EditReview';
import { BannerActionsProps } from '../services/banner/types';
import { setBanner } from '../services/banner/actions';
import { updateReview } from '../services/reviews/actions';
import { normalizeHeight, normalizeWidth } from '../utils/styles';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ReviewHistoryProps {
    reviews: ReviewProps[];
    setBanner: BannerActionsProps['setBanner'];
    updateReview: ReviewsActionsProps['updateReview'];
}


const ReviewHistory = ({ reviews, setBanner, updateReview }: ReviewHistoryProps) => {
    const [edit, setEdit] = useState(false);
    const [targetReview, setTargetReview] = useState<ReviewProps>()
    const listWidth: any = useRef(new Animated.Value(0)).current;
    const listHeight: any = useRef(new Animated.Value(0)).current;
    const keyboardRef: any = useRef(new Animated.Value(0)).current

    useEffect(() => {
        (!targetReview && reviews.length > 0) && setTargetReview(reviews[0]);
    }, [reviews])

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

    const handleShowFilterList = () => {
        if (listWidth._value > 0) {
            Animated.parallel([
                Animated.timing(listWidth, {
                    useNativeDriver: false,
                    toValue: 0,
                    easing: Easing.inOut(Easing.circle),
                    duration: 500,
                    delay: 100
                }),
                Animated.timing(listHeight, {
                    useNativeDriver: false,
                    toValue: 0,
                    easing: Easing.inOut(Easing.circle),
                    duration: 500,
                })
            ]).start()
        } else {
            Animated.parallel([
                Animated.timing(listWidth, {
                    useNativeDriver: false,
                    toValue: normalizeWidth(2.2),
                    easing: Easing.inOut(Easing.circle),
                    duration: 500,
                }),
                Animated.timing(listHeight, {
                    useNativeDriver: false,
                    toValue: normalizeHeight(3),
                    easing: Easing.inOut(Easing.circle),
                    duration: 500,
                    delay: 100
                })
            ]).start()
        }
    }

    const handleOnSubmitEditReview = (review: ReviewProps) => {
        updateReview(review)
    }

    const renderEditIcon = () => (
        edit ? <FontAwesome name="close" size={normalizeHeight(30)} color={Colors.white} style={styles.edit}
            onPress={() => setEdit(false)}
        /> : <FontAwesome name="pencil" size={normalizeHeight(30)} color={Colors.white} style={styles.edit}
            onPress={() => setEdit(true)}
            />
    )

    const renderFilterList = () => (
        <Animated.FlatList
            style={[styles.filterList, {
                width: listWidth,
                height: listHeight
            }
            ]}
            contentContainerStyle={styles.filterListItems}
            data={[...reviews].reverse()}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <Pressable onPress={() => {
                    setTargetReview(item)
                    handleShowFilterList()
                }} style={styles.filterItem}>
                    <AsapText style={styles.filterItemText}>{getDate(item.createdAt)}</AsapText>
                </Pressable>
            )}
        />
    )

    const renderHeaderDate = () => {
        let date = new Date();

        if (targetReview) {
            date = targetReview.createdAt
        }

        return (
            <View style={styles.headerDate}>
                <AsapText style={styles.headerDateDay}>{date.getDate()}</AsapText>
                <View>
                    <AsapText style={styles.headerDateMonYr}>{getDayName(date)}</AsapText>
                    <AsapText style={styles.headerDateMonYr}>{getMonthShort(date)} {date.getFullYear()}</AsapText>
                    {renderEditIcon()}
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <AsapText style={styles.headerSubText}>history</AsapText>
                    <AsapText style={styles.headerTitle}>Review</AsapText>
                </View>
                <View style={styles.filterContainer}>
                    <View>
                        <FontAwesome name="calendar" size={normalizeHeight(25)} color={Colors.white} style={{ zIndex: 10 }} onPress={handleShowFilterList} />
                        {renderFilterList()}
                    </View>
                    {renderHeaderDate()}
                </View>
                <ScrollView style={styles.review}>
                    {
                        targetReview && <EditReview
                            edit={edit}
                            review={targetReview}
                            setBanner={setBanner}
                            onSubmitReview={handleOnSubmitEditReview}
                        />
                    }
                </ScrollView>
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
        marginTop: normalizeHeight(30)
    },
    filterList: {
        position: 'absolute',
        top: -10,
        left: -10,
        backgroundColor: Colors.secondary,
        borderRadius: 20,
        paddingTop: 0
    },
    filterListItems: {
        flexDirection: 'column-reverse',
        alignItems: 'flex-end',
        padding: 20,
        marginBottom: 10
    },
    filterItem: {
        padding: 10,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        marginTop: 10
    },
    filterItemText: {
        fontSize: normalizeHeight(50),
        color: Colors.white
    },
    edit: {
        position: 'absolute',
        top: -20,
        right: -10
    },
    header: {
        flex: .15,
        alignSelf: 'center'
    },
    headerSubText: {
        fontSize: normalizeHeight(40),
        color: Colors.white,
        marginRight: 10,
        left: 5
    },
    headerTitle: {
        fontSize: normalizeHeight(15),
        color: Colors.white,
        top: -10
    },
    headerDate: {
        flexDirection: 'row',
        alignItems: 'center',
        left: 5,
        zIndex: -10
    },
    headerDateDay: {
        fontSize: normalizeHeight(25),
        color: Colors.white,
        marginRight: 10
    },
    headerDateMonYr: {
        fontSize: normalizeHeight(60),
        color: Colors.white
    },
    filterContainer: {
        flex: .2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100
    },
    review: {
        flex: 1
    }
})

const mapStateToProps = (state: ReducerStateProps) => ({
    reviews: state.reviews.reviews
})

export default connect(mapStateToProps, { setBanner, updateReview })(ReviewHistory)
