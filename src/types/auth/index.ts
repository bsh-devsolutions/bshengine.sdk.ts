import {BshDate, BshObject} from "@src/types/core";

export type LoginParams = {
    email: string;
    password: string;
}

export type AuthTokens = {
    access: string;
    refresh: string;
}

export type BshAuthSessionStatus = 'Active' | 'Expired' | 'Revoked' | 'LoggedOut';

export const BshSessionMetaData = {
    browsers: [
        'Edge', 'Opera', 'Samsung Internet', 'Firefox', 'Chrome', 'Safari',
        'Postman', 'curl', 'axios', 'node-fetch', 'Java', 'Python',
    ],
    os: ['Windows', 'iOS', 'Android', 'ChromeOS', 'macOS', 'Linux'],
    devices: ['Desktop', 'Mobile', 'Tablet', 'Other']
} as const;

export type BshBrowser = typeof BshSessionMetaData.browsers[number];
export type BshOS = typeof BshSessionMetaData.os[number];
export type BshDevice = typeof BshSessionMetaData.devices[number];

export type BshAuthSessionMetadata = {
    /** Readable summary, e.g. "Chrome 131 on macOS". */
    label?: string;
    browser?: BshBrowser;
    /** Major version for browsers, full version for HTTP clients. */
    browserVersion?: string;
    os?: BshOS;
    device?: BshDevice;
    /** Value of the X-Bsh-Client header sent at login. */
    client?: string;
    userAgent?: string;
};

export type BshAuthSession = Omit<BshObject, 'persistenceId'> & {
    sid: string;
    sub?: string;
    iat: BshDate;
    exp: BshDate;
    status: BshAuthSessionStatus;
    metadata?: BshAuthSessionMetadata;
    current: boolean;
}


export type BshRevokeSessionResult = {
    sid: string;
    message: string;
}
