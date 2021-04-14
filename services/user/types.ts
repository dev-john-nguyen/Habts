export interface UserProps {
    initializeUser: boolean;
    fetched: boolean;
    uid: string,
    name: string,
    email: string,
    notificationToken: string,
    notificationOn: boolean,
    trail: boolean,
    trailStartAt: Date,
    trailEndAt: Date,
    subType: string,
    subStartAt: Date,
    subEndAt: Date,
    subPaidAt: Date,
    createdAt: Date,
    expiredAt: Date,
    initializeUserData?: { createdAt: Date },
    subscription: string
}

export interface UserActionsProps {
    signUp: (email: string, password: string, password2: string) => Promise<void | undefined>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    saveNotificationToken: (token: string) => Promise<void>;
    subscriptionPurchased: (productId: string, purchaseTime: number) => Promise<void | undefined>
}