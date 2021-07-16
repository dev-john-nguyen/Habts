
export interface BannerProps {
    type: string;
    message: string;
    congratsBanner: {
        goalIndex: number;
        headerText: string;
    }
}

export interface BannerActionsProps {
    setBanner: (type: string, message: string) => void;
    removeBanner: () => void;
    setCongratsBanner: (goalIndex: number, headerText: string) => void;
    removeCongratsBanner: () => void;
}