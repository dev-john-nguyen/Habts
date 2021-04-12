import Layout from "../constants/Layout";


export function normalizeHeight(size: number) {
    const deviceHeight = Layout.window.height;
    return deviceHeight / size
}

export function normalizeWidth(size: number) {
    const deviceWidth = Layout.window.width;
    return deviceWidth / size
}

export class AutoId {
    static newId(len?: number): string {
        // Alphanumeric characters
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let autoId = '';
        let idLen = len ? len : 20
        for (let i = 0; i < idLen; i++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return autoId;
    }
}