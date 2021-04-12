
export interface BannerProps {
    type: string;
    message: string;
}

export interface BannerActionsProps {
    setBanner: (type: string, message: string) => void;
    removeBanner: () => void;
}