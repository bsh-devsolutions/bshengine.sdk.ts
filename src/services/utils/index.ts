import { BshClient } from "@src/client/bsh-client";
import { BshResponse, BshTriggerFunction, BshTriggerAction } from "@types";
import { BshCallbackParams } from "@src/services";
import { SecretSource } from "@src/types/secrets";

export class BshUtilsService {
    private readonly baseEndpoint = '/api/utils';

    public constructor(private readonly client: BshClient) {
    }

    public async triggerFunctions(params?: BshCallbackParams<unknown, BshTriggerFunction>): Promise<BshResponse<BshTriggerFunction> | undefined> {
        return this.client.get<BshTriggerFunction>({
            path: `${this.baseEndpoint}/triggers/functions`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
            },
            bshOptions: { onSuccess: params?.onSuccess, onError: params?.onError },
            api: 'utils.triggerFunctions',
        });
    }

    public async triggerActions(params?: BshCallbackParams<unknown, BshTriggerAction>): Promise<BshResponse<BshTriggerAction> | undefined> {
        return this.client.get<BshTriggerAction>({
            path: `${this.baseEndpoint}/triggers/actions`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
            },
            bshOptions: { onSuccess: params?.onSuccess, onError: params?.onError },
            api: 'utils.triggerActions',
        });
    }

    public async secrets(params?: BshCallbackParams<unknown, SecretSource> & {source?: string}): Promise<BshResponse<SecretSource> | undefined> {
        return this.client.get<SecretSource>({
            path: `${this.baseEndpoint}/secrets/${params?.source || 'env'}`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
            },
            bshOptions: { onSuccess: params?.onSuccess, onError: params?.onError },
            api: 'utils.secretsEnv',
        });
    }

    public async version(params?: BshCallbackParams<unknown, {version: string}>): Promise<BshResponse<{version: string}> | undefined> {
        return this.client.get<{version: string}>({
            path: `${this.baseEndpoint}/version`,
            options: {
                responseType: 'json',
                requestFormat: 'json',
            },
            bshOptions: { onSuccess: params?.onSuccess, onError: params?.onError },
            api: 'utils.version',
        });
    }
}
