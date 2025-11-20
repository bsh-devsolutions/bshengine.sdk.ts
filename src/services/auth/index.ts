
import { BshClient } from "@src/client/bsh-client";
import { BshResponse, BshUser, BshUserInit } from "@types";
import { BshCallbackParamsWithPayload } from "@src/services";

export type LoginParams = {
    email: string;
    password: string;
}

export type LoginResponse = {
    access: string;
    refresh: string;
}

export class AuthService {
    private readonly baseEndpoint = '/api/auth';

    public constructor(private readonly client: BshClient) {
    }

    public async login(params: BshCallbackParamsWithPayload<LoginParams, LoginResponse>): Promise<BshResponse<LoginResponse> | undefined> {
        return this.client.post<LoginResponse>({
            path: `${this.baseEndpoint}/login`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    public async register(params: BshCallbackParamsWithPayload<BshUserInit, BshUser>): Promise<BshResponse<BshUser> | undefined> {
        return this.client.post<BshUser>({
            path: `${this.baseEndpoint}/register`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    public async refreshToken(params: BshCallbackParamsWithPayload<{ refresh: string }, LoginResponse>): Promise<BshResponse<LoginResponse> | undefined> {
        return this.client.post<LoginResponse>({
            path: `${this.baseEndpoint}/refresh`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    public async forgetPassword(
        params: BshCallbackParamsWithPayload<{ email: string }, unknown >): Promise<BshResponse<unknown> | undefined> {
        return this.client.post<unknown>({
            path: `${this.baseEndpoint}/forget-password`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    public async resetPassword(params: BshCallbackParamsWithPayload<{ email: string, code: string, newPassword: string }, unknown>): Promise<BshResponse<unknown> | undefined> {
        return this.client.post<unknown>({
            path: `${this.baseEndpoint}/reset-password`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    public async activateAccount(params: BshCallbackParamsWithPayload<{ email: string, code: string }, unknown>): Promise<BshResponse<unknown> | undefined> {
        return this.client.post<unknown>({
            path: `${this.baseEndpoint}/activate-account`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }
}
