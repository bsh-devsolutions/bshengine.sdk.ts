import { BshResponse, BshSearch } from '@types';
import { BshError } from '@types';

export type BshCallbackParams<T = unknown, R = T> = {
    onSuccess?: (response: BshResponse<R>) => void;
    onDownload?: (blob: Blob) => void;
    onError?: (error: BshError) => void;
    byPass?: {
        interceptors?: {
            pre?: boolean
            post?: boolean
            error?: boolean
        }
    }
}

export type BshCallbackParamsWithPayload<T = unknown, R = T> = BshCallbackParams<T, R> & {
    payload: T;
}

export type BshSearchCallbackParams <T, R = T> = BshCallbackParamsWithPayload<BshSearch<T>, R>

export * from './entities';
export * from './auth';
export * from './user';
export * from './settings';
export * from './image';
export * from './mailing';
export * from './utils';
export * from './caching';
export * from './api-key';
