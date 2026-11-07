import { BshDate, BshObject } from "@src/types/core";

export type LoginParams = {
    email: string;
    password: string;
}

export type AuthTokens = {
    access: string;
    refresh: string;
}

export type BshAuthSessionStatus = 'Active' | 'Expired' | 'Revoked' | 'LoggedOut';

export type BshAuthSession = Omit<BshObject, 'persistenceId'> & {
    sid: string;
    sub?: string;
    iat: BshDate;
    exp: BshDate;
    status: BshAuthSessionStatus;
    /** True when this is the session used by the current request. */
    current: boolean;
}

export type BshRevokeSessionResult = {
    sid: string;
    message: string;
}
