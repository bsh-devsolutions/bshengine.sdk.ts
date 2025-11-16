import { BshClient } from "@src/client/bsh-client";
import { BshResponse, UploadResponse, UploadOptions } from "@types";
import { bshConfigs } from "@config";
import { BshCallbackParams } from "@src/services";

export class ImageService {
    private static instance: ImageService;
    private readonly baseEndpoint = '/api/images';

    private constructor() {
    }

    private get client(): BshClient {
        return bshConfigs.createClient();
    }

    public static getInstance(): ImageService {
        if (!ImageService.instance) {
            ImageService.instance = new ImageService();
        }
        return ImageService.instance;
    }

    public async upload(params: BshCallbackParams<unknown, UploadResponse> & {
        file: File;
        namespace?: string;
        assetId?: string;
        options?: UploadOptions;
    }): Promise<BshResponse<UploadResponse> | undefined> {
        const formData = new FormData();
        formData.set('file', params.file);
        if (params.namespace) formData.set('namespace', params.namespace);
        if (params.assetId) formData.set('assetId', params.assetId);
        if (params.options) formData.set('options', JSON.stringify(params.options));

        return this.client.post<UploadResponse>({
            path: `${this.baseEndpoint}/upload`,
            options: {
                responseType: 'json',
                requestFormat: 'form',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
            bshOptions: { onSuccess: params.onSuccess, onError: params.onError },
        });
    }
}

