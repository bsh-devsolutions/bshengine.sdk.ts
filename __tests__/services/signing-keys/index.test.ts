import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SigningKeyService } from '../../../src/services/signing-keys';
import { BshClient } from '../../../src/client/bsh-client';
import { BshSigningKey } from '../../../src/types';
import { CoreEntities } from '../../../src/types/core';

describe('SigningKeyService', () => {
    let service: SigningKeyService;
    let mockGet: ReturnType<typeof vi.fn>;
    let mockPost: ReturnType<typeof vi.fn>;

    const key: BshSigningKey = {
        kid: 'kid-1',
        status: 'Active',
        activatedAt: { $date: '2026-11-13T10:00:00Z' },
        rotatesAt: { $date: '2026-12-13T10:00:00Z' },
        rotation: 'Scheduled',
    };
    const response = { data: [key], code: 200, status: 'OK', timestamp: Date.now() };

    beforeEach(() => {
        mockGet = vi.fn().mockResolvedValue(response);
        mockPost = vi.fn().mockResolvedValue(response);
        const mockClient = {
            get: mockGet,
            post: mockPost,
            put: vi.fn(),
            delete: vi.fn(),
            patch: vi.fn(),
            download: vi.fn(),
        } as unknown as BshClient;
        service = new SigningKeyService(mockClient);
    });

    it('search should POST the search payload to /api/auth/signing-keys/search', async () => {
        const params = { payload: { filters: [{ field: 'status', operator: 'in', value: ['Active', 'Retired'] }] } } as any;
        const result = await service.search(params);

        expect(mockPost).toHaveBeenCalledWith({
            path: '/api/auth/signing-keys/search',
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: { 'Content-Type': 'application/json' },
            },
            bshOptions: params,
            entity: CoreEntities.BshJWTSigningSecret,
            api: 'signing-keys.search',
        });
        expect(result).toEqual(response);
    });

    it('list should GET /api/auth/signing-keys with query params', async () => {
        await service.list({ queryParams: { page: '0', size: '10', sort: 'activatedAt:desc', filter: 'status:eq:Active' } });

        expect(mockGet).toHaveBeenCalledWith(expect.objectContaining({
            path: '/api/auth/signing-keys?page=0&size=10&sort=activatedAt%3Adesc&filter=status%3Aeq%3AActive',
            api: 'signing-keys.list',
        }));
    });

    it('list should GET /api/auth/signing-keys without query params', async () => {
        await service.list({});

        expect(mockGet).toHaveBeenCalledWith(expect.objectContaining({ path: '/api/auth/signing-keys' }));
    });

    it('rotate should POST the options to /api/auth/signing-keys/rotate', async () => {
        const params = { payload: { expire: 'previous' as const, reason: 'suspected leak' } };
        await service.rotate(params);

        expect(mockPost).toHaveBeenCalledWith({
            path: '/api/auth/signing-keys/rotate',
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: { 'Content-Type': 'application/json' },
            },
            bshOptions: params,
            entity: CoreEntities.BshJWTSigningSecret,
            api: 'signing-keys.rotate',
        });
    });

    it('expire should POST the reason to /api/auth/signing-keys/{kid}/expire', async () => {
        const params = { kid: 'kid-2', payload: { reason: 'leaked in logs' } };
        await service.expire(params);

        expect(mockPost).toHaveBeenCalledWith({
            path: '/api/auth/signing-keys/kid-2/expire',
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: { 'Content-Type': 'application/json' },
            },
            bshOptions: params,
            entity: CoreEntities.BshJWTSigningSecret,
            api: 'signing-keys.expire',
        });
    });
});
