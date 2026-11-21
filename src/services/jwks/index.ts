import { BshClient } from "@src/client/bsh-client";
import { BshJwks, BshJwksParams } from "@types";

/**
 * Public JSON Web Key Set (`/.well-known/jwks.json`): the keys that verify access tokens, active key first.
 * No login needed. Use it through {@link BshEngine.jwks}.
 */
export class JwksService {
    private readonly endpoint = '/.well-known/jwks.json';

    public constructor(private readonly client: BshClient) {
    }

    /**
     * Pick the key whose `kid` matches the token header to verify the engine's access tokens in another service.
     * The response is the raw JWK Set, not a `BshResponse`, so post interceptors are skipped.
     */
    public async load(params?: BshJwksParams): Promise<BshJwks | undefined> {
        const response = await this.client.get<unknown>({
            path: this.endpoint,
            options: {
                responseType: 'json',
                requestFormat: 'json',
            },
            bshOptions: {
                onSuccess: params?.onSuccess as ((response: unknown) => void) | undefined,
                onError: params?.onError,
                byPass: { interceptors: { post: true } },
            },
            api: 'jwks',
        }) as unknown as BshJwks | undefined;
        if (!response) return undefined;
        return { keys: response.keys };
    }
}
