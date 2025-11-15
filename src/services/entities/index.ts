import { BshClient } from "@src/client/bsh-client";
import { BshError, BshResponse, BshSearch } from "@types";
import { bshConfigs } from "@config";

export type EntityCallbackParams<T = unknown, R = T> = {
    onSuccess?: (response: BshResponse<R>) => void;
    onDownload?: (blob: Blob) => void;
    onError?: (error: BshError) => void;
}

export type EntityFnParams<T = unknown, R = T> = EntityCallbackParams<T, R> & {entity: string} 

export class EntityService {
    private static instance: EntityService;
    private readonly baseEndpoint = '/api/entities';

    private constructor() {
        // Private constructor to enforce singleton pattern
    }

    /**
     * Get the client instance, always using the current global configuration.
     * This ensures that if global configs change, the service will use the updated configs.
     */
    private get client(): BshClient { // TODO: look for better way to get the client
        return bshConfigs.createClient();
    }

    public static getInstance(): EntityService {
        if (!EntityService.instance) {
            EntityService.instance = new EntityService();
        }
        return EntityService.instance;
    }

    /**
     * Reset the singleton instance. Useful when global configs change
     * and you want to ensure a fresh instance is created.
     */
    public static reset(): void {
        EntityService.instance = undefined as any;
    }

    // Get a single entity by ID
    public async findById<T>(params: EntityFnParams<T> & { id: string }): Promise<BshResponse<T> | undefined> {
        return this.client.get<T>({
            path: `${this.baseEndpoint}/${params.entity}/${params.id}`,
            options: {
                responseType: 'json',
                responseFormat: 'json',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    // Create a new entity
    public async create<T>(
        params: EntityFnParams<T> & { data: T }
    ): Promise<BshResponse<T> | undefined> {
        return this.client.post<T>({
            path: `${this.baseEndpoint}/${params.entity}`,
            options: {
                responseType: 'json',
                responseFormat: 'json',
                body: params.data,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    // Create multiple entities in batch
    public async createMany<T>(
        params: EntityFnParams<T> & { data: T[] }
    ): Promise<BshResponse<T> | undefined> {
        return this.client.post<T>({
            path: `${this.baseEndpoint}/${params.entity}/batch`,
            options: {
                responseType: 'json',
                responseFormat: 'json',
                body: params.data,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    // Update an existing entity
    public async update<T>(
        params: EntityFnParams<T> & { data: T }
    ): Promise<BshResponse<T> | undefined> {
        return this.client.put<T>({
            path: `${this.baseEndpoint}/${params.entity}`,
            options: {
                responseType: 'json',
                responseFormat: 'json',
                body: params.data,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    // Update multiple entities in batch
    public async updateMany<T>(
        params: EntityFnParams<T> & { data: T[] }
    ): Promise<BshResponse<T> | undefined> {
        return this.client.put<T>({
            path: `${this.baseEndpoint}/${params.entity}/batch`,
            options: {
                responseType: 'json',
                responseFormat: 'json',
                body: params.data,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    // Search for entities
    public async search<T>(
        params: EntityFnParams<T> & { search: BshSearch<T> }
    ): Promise<BshResponse<T> | undefined> {
        return this.client.post<T>({
            path: `${this.baseEndpoint}/${params.entity}/search`,
            options: {
                responseType: 'json',
                responseFormat: 'json',
                body: params.search,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    // Delete entities by search criteria
    public async delete<T>(
        params: EntityFnParams<T, { effected: number }> & { search: BshSearch<T> }
    ): Promise<BshResponse<{ effected: number }> | undefined> {
        return this.client.post<{ effected: number }>({
            path: `${this.baseEndpoint}/${params.entity}/delete`,
            options: {
                responseType: 'json',
                responseFormat: 'json',
                body: params.search,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    // Delete a single entity by ID
    public async deleteById<T>(
        params: EntityFnParams<T, { effected: number }> & { id: string }
    ): Promise<BshResponse<{ effected: number }> | undefined> {
        return this.client.delete<{ effected: number }>({
            path: `${this.baseEndpoint}/${params.entity}/${params.id}`,
            options: {
                responseType: 'json',
                responseFormat: 'json',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    // Get entity columns
    public async columns(
        params: EntityFnParams<unknown, { name: string; type: string }>
    ): Promise<BshResponse<{ name: string; type: string }> | undefined> {
        return this.client.get<{ name: string; type: string }>({
            path: `${this.baseEndpoint}/${params.entity}/columns`,
            options: {
                responseType: 'json',
                responseFormat: 'json',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }

    // Export entities
    public async export<T>(
        params: EntityFnParams<T, Blob> & {
            search: BshSearch<T>,
            format: 'csv' | 'json' | 'excel',
            filename?: string,
        }
    ): Promise<void> {
        const defaultName = `${params.entity}_export_${new Date().toISOString().split('T')[0]}`;
        const exportFilename = params.filename || `${defaultName}.${params.format == 'excel' ? 'xlsx' : params.format}`;

        await this.client.download<T>({
            path: `${this.baseEndpoint}/${params.entity}/export?format=${params.format}&filename=${exportFilename}`,
            options: {
                responseType: 'blob',
                responseFormat: 'json',
                body: params.search,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            bshOptions: { onDownload: params.onDownload, onError: params.onError },
        });
    }
}
