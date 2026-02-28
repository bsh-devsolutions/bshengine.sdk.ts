import { BshClient } from "@src/client/bsh-client";
import { BshResponse, BshTenant, BshTenantPure, BshSearch } from "@types";
import { BshCallbackParams, BshCallbackParamsWithPayload, BshSearchCallbackParams } from "@src/services";
import { CoreEntities } from "@src/types/core";

export class TenantService {
    private readonly baseEndpoint = '/api/tenants';

    public constructor(private readonly client: BshClient) {
    }

    public async create<T = BshTenant>(params: BshCallbackParamsWithPayload<BshTenantPure, T>): Promise<BshResponse<T> | undefined> {
        console.log('params', params);
        return this.client.post<T>({
            path: this.baseEndpoint,
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: params,
            api: 'tenants.create',
            entity: CoreEntities.BshTenants,
        });
    }

    public async assignAdmin<T = BshTenant>(params: BshCallbackParams<{ id: string, adminId: string }, T> & { id: string, adminId: string }): Promise<BshResponse<T> | undefined> {
        return this.client.put<T>({
            path: `${this.baseEndpoint}/${params.id}/admin/${params.adminId}`,
            options: {
                responseType: 'json',
            },
            bshOptions: params,
            api: 'tenants.assignAdmin',
            entity: CoreEntities.BshTenants,
        });
    }

    public async activate<T = BshTenant>(params: BshCallbackParams<{ id: string }, T> & { id: string }): Promise<BshResponse<T> | undefined> {
        return this.client.post<T>({
            path: `${this.baseEndpoint}/${params.id}/activate`,
            options: {
                responseType: 'json',
            },
            bshOptions: params,
            api: 'tenants.activate',
            entity: CoreEntities.BshTenants,
        });
    }

    public async deactivate<T = BshTenant>(params: BshCallbackParams<{ id: string }, T> & { id: string }): Promise<BshResponse<T> | undefined> {
        return this.client.post<T>({
            path: `${this.baseEndpoint}/${params.id}/deactivate`,
            options: {
                responseType: 'json',
            },
            bshOptions: params,
            api: 'tenants.deactivate',
            entity: CoreEntities.BshTenants,
        });
    }

    public async block<T = BshTenant>(params: BshCallbackParams<{ id: string }, T> & { id: string }): Promise<BshResponse<T> | undefined> {
        return this.client.post<T>({
            path: `${this.baseEndpoint}/${params.id}/block`,
            options: {
                responseType: 'json',
            },
            bshOptions: params,
            api: 'tenants.block',
            entity: CoreEntities.BshTenants,
        });
    }

    public async getById<T = BshTenant>(params: BshCallbackParams<{ id: string }, T> & { id: string }): Promise<BshResponse<T> | undefined> {
        return this.client.get<T>({
            path: `${this.baseEndpoint}/${params.id}`,
            options: {
                responseType: 'json',
            },
            bshOptions: params,
            api: 'tenants.getById',
            entity: CoreEntities.BshTenants,
        });
    }

    public async search<T = BshTenant>(params: BshSearchCallbackParams<BshTenant, T>): Promise<BshResponse<T> | undefined> {
        return this.client.post<T>({
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
            api: 'tenants.search',
            entity: CoreEntities.BshTenants,
        });
    }

    public async list<T = BshTenant>(params: BshCallbackParams<unknown, T> & { page?: number, size?: number, sort?: string, filter?: string }): Promise<BshResponse<T> | undefined> {
        const queryParams: Record<string, string> = {};
        if (params.page !== undefined) queryParams.page = params.page.toString();
        if (params.size !== undefined) queryParams.size = params.size.toString();
        if (params.sort !== undefined) queryParams.sort = params.sort;
        if (params.filter !== undefined) queryParams.filter = params.filter;

        return this.client.get<T>({
            path: this.baseEndpoint,
            options: {
                responseType: 'json',
                queryParams,
            },
            bshOptions: params,
            api: 'tenants.list',
            entity: CoreEntities.BshTenants,
        });
    }

    public async update<T = BshTenant>(params: BshCallbackParamsWithPayload<Partial<T>, T>): Promise<BshResponse<T> | undefined> {
        return this.client.put<T>({
            path: this.baseEndpoint,
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: params,
            api: 'tenants.update',
            entity: CoreEntities.BshTenants,
        });
    }

    public async delete<T = any>(params: BshCallbackParams<{ id: string }, T> & { id: string }): Promise<BshResponse<T> | undefined> {
        return this.client.delete<T>({
            path: `${this.baseEndpoint}/${params.id}`,
            options: {
                responseType: 'json',
            },
            bshOptions: params,
            api: 'tenants.delete',
            entity: CoreEntities.BshTenants,
        });
    }

    public async count<T = { count: number }>(params: BshCallbackParams<unknown, T>): Promise<BshResponse<T> | undefined> {
        return this.client.get<T>({
            path: `${this.baseEndpoint}/count`,
            options: {
                responseType: 'json',
            },
            bshOptions: params,
            api: 'tenants.count',
            entity: CoreEntities.BshTenants,
        });
    }

    public async countFiltered<T = { count: number }>(params: BshSearchCallbackParams<BshTenant, T>): Promise<BshResponse<T> | undefined> {
        return this.client.post<T>({
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
            api: 'tenants.countFiltered',
            entity: CoreEntities.BshTenants,
        });
    }
}
