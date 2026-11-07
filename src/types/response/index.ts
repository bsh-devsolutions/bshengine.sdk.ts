export type BshErrorCode =
    | 'JWT__SESSION_EXPIRED'
    | 'JWT__EXPIRED'
    | 'JWT__UNSUPPORTED'
    | 'JWT__MALFORMED'
    | 'JWT__INVALID_SIGNATURE'
    | 'JWT__INVALID'
    | 'JWT__INVALID_TYP'
    | 'API__NOT_FOUND'

export type BshResponse<T> = {
    data: T[]
    timestamp: number
    code: number
    status: string
    message?: string
    error?: string
    meta?: {
        type?: string,
        sql?: string,
        error?: string,
        tips?: {[key: string]: string},
        accessToken?: string,
        refreshToken?: string,
        bshError?: BshErrorCode,
    }
    pagination?: {
        current: number,
        total: number,
        pages: number,
        first: boolean,
        last: boolean
    }
    endpoint?: string,
    api?: string,
    validations?: {field: string, error: string}[]
}

export const isOk = (response: BshResponse<unknown> | undefined) => response == undefined ? false : response?.code >= 200 && response?.code < 300

/** True when the engine rejected the request because the auth session is over (user must log in again). */
export const isExpired = (error: BshError | BshResponse<unknown> | undefined) => {
    const response = error instanceof BshError ? error.response : error
    return response?.meta?.bshError === 'JWT__SESSION_EXPIRED'
}

export class BshError extends Error {
    constructor(
        public status: number,
        public endpoint: string,
        public response?: BshResponse<unknown>
    ) {
        if (response) response.endpoint = endpoint
        super(JSON.stringify(response, null, 2));
        this.name = 'BshError';
    }
}
