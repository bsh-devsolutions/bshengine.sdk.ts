import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JwksService } from '../../../src/services/jwks';
import { BshClient } from '../../../src/client/bsh-client';
import { BshJwks } from '../../../src/types';

describe('JwksService', () => {
    let service: JwksService;
    let mockGet: ReturnType<typeof vi.fn>;

    const jwks: BshJwks = {
        keys: [{
            kty: 'EC', crv: 'P-256', x: 'h7I0BWOoM31TIzIHRKgU4kzKGMSWofcwz1KU3_Az2as', y: 'Owiaoq-WMdzojUajSxx4Z1ZgW6snsgbUZ_9uN5CRd3c',
            kid: 'kid-1', alg: 'ES256', use: 'sig', key_ops: ['verify'],
        }],
    };

    beforeEach(() => {
        mockGet = vi.fn().mockResolvedValue({ ...jwks, api: 'jwks' });
        const mockClient = {
            get: mockGet,
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            patch: vi.fn(),
            download: vi.fn(),
        } as unknown as BshClient;
        service = new JwksService(mockClient);
    });

    it('load should GET /.well-known/jwks.json and skip post interceptors', async () => {
        await service.load();

        expect(mockGet).toHaveBeenCalledWith({
            path: '/.well-known/jwks.json',
            options: { responseType: 'json', requestFormat: 'json' },
            bshOptions: { onSuccess: undefined, onError: undefined, byPass: { interceptors: { post: true } } },
            api: 'jwks',
        });
    });

    it('load should return only the keys, without the client metadata', async () => {
        expect(await service.load()).toEqual(jwks);
    });

    it('load should pass the callbacks and return undefined when they handle the response', async () => {
        mockGet.mockResolvedValue(undefined);
        const onSuccess = vi.fn();
        const onError = vi.fn();

        const result = await service.load({ onSuccess, onError });

        expect(mockGet).toHaveBeenCalledWith(expect.objectContaining({
            bshOptions: { onSuccess, onError, byPass: { interceptors: { post: true } } },
        }));
        expect(result).toBeUndefined();
    });
});
