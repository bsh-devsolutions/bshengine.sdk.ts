import { BshClient } from "@src/client/bsh-client";
import { BshResponse, BshSigningKey, BshRotateSigningKey, BshRotateSigningKeyResult, BshExpireSigningKey } from "@types";
import { BshCallbackParams, BshCallbackParamsWithPayload, BshSearchCallbackParams } from "@src/services";
import { CoreEntities } from "@src/types/core";

/**
 * JWT signing keys (`/api/auth/signing-keys`). BSH admin only.
 * The key material is never returned.
 */
export class SigningKeyService {
    private readonly baseEndpoint = '/api/auth/signing-keys';

    public constructor(private readonly client: BshClient) {
    }

    public async search(params: BshSearchCallbackParams<BshSigningKey, BshSigningKey>): Promise<BshResponse<BshSigningKey> | undefined> {
        return this.client.post<BshSigningKey>({
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
            entity: CoreEntities.BshJWTSigningSecret,
            api: 'signing-keys.search',
        });
    }

    public async list(params: BshCallbackParams<unknown, BshSigningKey> & {
        queryParams?: {
            page?: string;
            size?: string;
            sort?: string;
            filter?: string;
        }
    }): Promise<BshResponse<BshSigningKey> | undefined> {
        const urlSearchParams = new URLSearchParams();
        if (params.queryParams?.page) urlSearchParams.append('page', params.queryParams.page);
        if (params.queryParams?.size) urlSearchParams.append('size', params.queryParams.size);
        if (params.queryParams?.sort) urlSearchParams.append('sort', params.queryParams.sort);
        if (params.queryParams?.filter) urlSearchParams.append('filter', params.queryParams.filter);

        const queryString = urlSearchParams.toString();
        const endpoint = queryString ? `?${queryString}` : '';

        return this.client.get<BshSigningKey>({
            path: `${this.baseEndpoint}${endpoint}`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
            },
            bshOptions: params,
            entity: CoreEntities.BshJWTSigningSecret,
            api: 'signing-keys.list',
        });
    }

    /**
     * Forces a rotation. `expire: 'previous' | 'all'` expires the previous key(s) immediately:
     * every user with tokens signed by them is logged out. `reason` is required when expiring.
     */
    public async rotate(params: BshCallbackParamsWithPayload<BshRotateSigningKey, BshRotateSigningKeyResult>): Promise<BshResponse<BshRotateSigningKeyResult> | undefined> {
        return this.client.post<BshRotateSigningKeyResult>({
            path: `${this.baseEndpoint}/rotate`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: params,
            entity: CoreEntities.BshJWTSigningSecret,
            api: 'signing-keys.rotate',
        });
    }

    /** Expires a retired key now. The active key cannot be expired, rotate it instead. */
    public async expire(params: BshCallbackParamsWithPayload<BshExpireSigningKey, BshSigningKey> & { kid: string }): Promise<BshResponse<BshSigningKey> | undefined> {
        return this.client.post<BshSigningKey>({
            path: `${this.baseEndpoint}/${params.kid}/expire`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: params,
            entity: CoreEntities.BshJWTSigningSecret,
            api: 'signing-keys.expire',
        });
    }
}
