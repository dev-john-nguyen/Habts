export interface ReviewProps {
    docId: string;
    createdAt: Date
    updatedAt?: Date
    rating: number
    good: string
    bad: string
    learn: string;
    archived?: boolean;
    notificationOn: boolean;
}

export interface ReviewsProps {
    reviews: ReviewProps[]
}

export interface ReviewsActionsProps {
    addNewReview: (review: ReviewProps) => Promise<void | undefined>;
    updateReview: (review: ReviewProps) => Promise<void | undefined>;
}