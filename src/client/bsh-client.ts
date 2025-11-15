import { BshResponse, BshError } from "@types";
import { BshClientFn, BshClientFnParams } from "@src/client/types";

export class BshClient {
    constructor(
        private readonly host: string,
        private readonly httpClient: BshClientFn
    ) {}

    async get<T = unknown>(params: BshClientFnParams<T>): Promise<BshResponse<T>> {
        const response = await this.httpClient({ ...params, path: `${this.host}${params.path}` });
        if (!response.ok) throw new BshError(response.status, params.path, await response.json());
        return await response.json();
    }

    async post<T = unknown>(params: BshClientFnParams<T>): Promise<BshResponse<T>> {
        const response = await this.httpClient({ ...params, path: `${this.host}${params.path}` });
        if (!response.ok) throw new BshError(response.status, params.path, await response.json());
        return await response.json();
    }

    async put<T = unknown>(params: BshClientFnParams<T>): Promise<BshResponse<T>> {
        const response = await this.httpClient({ ...params, path: `${this.host}${params.path}` });
        if (!response.ok) throw new BshError(response.status, params.path, await response.json());
        return await response.json();
    }

    async delete<T = unknown>(params: BshClientFnParams<T>): Promise<BshResponse<T>> {
        const response = await this.httpClient({ ...params, path: `${this.host}${params.path}` });
        if (!response.ok) throw new BshError(response.status, params.path, await response.json());
        return await response.json();
    }

    async patch<T = unknown>(params: BshClientFnParams<T>): Promise<BshResponse<T>> {
        const response = await this.httpClient({ ...params, path: `${this.host}${params.path}` });
        if (!response.ok) throw new BshError(response.status, params.path, await response.json());
        return await response.json();
    }

    async download<T = unknown>(params: BshClientFnParams<T>): Promise<Blob> {
        const response = await this.httpClient({ ...params, path: `${this.host}${params.path}` });
        if (!response.ok) throw new BshError(response.status, params.path, await response.json());
        return await response.blob();
    }
}