import { BshClient } from "@src/client/bsh-client";
import { BshResponse, BshAuthSession, BshRevokeSessionResult } from "@types";
import { BshCallbackParams, BshSearchCallbackParams } from "@src/services";
import { CoreEntities } from "@src/types/core";

/**
 * Auth sessions of the logged-in user (`/api/auth/sessions`).
 * Requires user authentication (JWT or cookie session), API keys are rejected.
 * Regular users only see their own sessions.
 */
export class AuthSessionService {
    private readonly baseEndpoint = '/api/auth/sessions';

    public constructor(private readonly client: BshClient) {
    }

    public async current(params: BshCallbackParams<unknown, BshAuthSession>): Promise<BshResponse<BshAuthSession> | undefined> {
        return this.client.get<BshAuthSession>({
            path: `${this.baseEndpoint}/current`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
            },
            bshOptions: params,
            entity: CoreEntities.BshAuthSessions,
            api: 'auth-sessions.current',
        });
    }

    public async details(params: BshCallbackParams<unknown, BshAuthSession> & { sid: string }): Promise<BshResponse<BshAuthSession> | undefined> {
        return this.client.get<BshAuthSession>({
            path: `${this.baseEndpoint}/${params.sid}`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
            },
            bshOptions: params,
            entity: CoreEntities.BshAuthSessions,
            api: 'auth-sessions.details',
        });
    }

    /** Revokes another session. The current session cannot be revoked, use `auth.logout` instead. */
    public async revoke(params: BshCallbackParams<unknown, BshRevokeSessionResult> & { sid: string }): Promise<BshResponse<BshRevokeSessionResult> | undefined> {
        return this.client.delete<BshRevokeSessionResult>({
            path: `${this.baseEndpoint}/${params.sid}/revoke`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
            },
            bshOptions: params,
            entity: CoreEntities.BshAuthSessions,
            api: 'auth-sessions.revoke',
        });
    }

    public async search(params: BshSearchCallbackParams<BshAuthSession, BshAuthSession>): Promise<BshResponse<BshAuthSession> | undefined> {
        return this.client.post<BshAuthSession>({
            path: `${this.baseEndpoint}/search`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: params,
            entity: CoreEntities.BshAuthSessions,
            api: 'auth-sessions.search',
        });
    }

    /** e.g. `queryParams: { sort: 'iat:desc', filter: 'status:eq:Active' }` */
    public async list(params: BshCallbackParams<unknown, BshAuthSession> & {
        queryParams?: {
            page?: string;
            size?: string;
            sort?: string;
            filter?: string;
        }
    }): Promise<BshResponse<BshAuthSession> | undefined> {
        const urlSearchParams = new URLSearchParams();
        if (params.queryParams?.page) urlSearchParams.append('page', params.queryParams.page);
        if (params.queryParams?.size) urlSearchParams.append('size', params.queryParams.size);
        if (params.queryParams?.sort) urlSearchParams.append('sort', params.queryParams.sort);
        if (params.queryParams?.filter) urlSearchParams.append('filter', params.queryParams.filter);

        const queryString = urlSearchParams.toString();
        const endpoint = queryString ? `?${queryString}` : '';

        return this.client.get<BshAuthSession>({
            path: `${this.baseEndpoint}${endpoint}`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
            },
            bshOptions: params,
            entity: CoreEntities.BshAuthSessions,
            api: 'auth-sessions.list',
        });
    }

    public async count(
        params: BshCallbackParams<unknown, {count: number}>
    ): Promise<BshResponse<{count: number}> | undefined> {
        return this.client.get<{count: number}>({
            path: `${this.baseEndpoint}/count`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
            },
            bshOptions: params,
            entity: CoreEntities.BshAuthSessions,
            api: 'auth-sessions.count',
        });
    }

    public async countFiltered(params: BshSearchCallbackParams<BshAuthSession, {count: number}>): Promise<BshResponse<{count: number}> | undefined> {
        return this.client.post<{count: number}>({
            path: `${this.baseEndpoint}/count`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: params,
            entity: CoreEntities.BshAuthSessions,
            api: 'auth-sessions.countFiltered',
        });
    }
}
