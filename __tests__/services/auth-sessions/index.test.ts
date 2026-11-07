import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthSessionService } from '../../../src/services/auth-sessions';
import { BshClient } from '../../../src/client/bsh-client';
import { BshAuthSession } from '../../../src/types';
import { CoreEntities } from '../../../src/types/core';

describe('AuthSessionService', () => {
    let service: AuthSessionService;
    let mockGet: ReturnType<typeof vi.fn>;
    let mockPost: ReturnType<typeof vi.fn>;
    let mockDelete: ReturnType<typeof vi.fn>;

    const session: BshAuthSession = {
        sid: 'sid-1',
        sub: 'user-1',
        iat: { $date: '2026-11-07T10:00:00Z' },
        exp: { $date: '2026-12-07T10:00:00Z' },
        status: 'Active',
        current: true,
    };
    const response = { data: [session], code: 200, status: 'OK', timestamp: Date.now() };

    beforeEach(() => {
        mockGet = vi.fn().mockResolvedValue(response);
        mockPost = vi.fn().mockResolvedValue(response);
        mockDelete = vi.fn().mockResolvedValue(response);
        const mockClient = {
            get: mockGet,
            post: mockPost,
            put: vi.fn(),
            delete: mockDelete,
            patch: vi.fn(),
            download: vi.fn(),
        } as unknown as BshClient;
        service = new AuthSessionService(mockClient);
    });

    it('current should GET /api/auth/sessions/current', async () => {
        const params = { onSuccess: vi.fn() };
        const result = await service.current(params);

        expect(mockGet).toHaveBeenCalledWith({
            path: '/api/auth/sessions/current',
            options: { responseType: 'json', requestFormat: 'json' },
            bshOptions: params,
            entity: CoreEntities.BshAuthSessions,
            api: 'auth-sessions.current',
        });
        expect(result).toEqual(response);
    });

    it('details should GET /api/auth/sessions/{sid}', async () => {
        const params = { sid: 'sid-1' };
        await service.details(params);

        expect(mockGet).toHaveBeenCalledWith(expect.objectContaining({
            path: '/api/auth/sessions/sid-1',
            api: 'auth-sessions.details',
        }));
    });

    it('revoke should DELETE /api/auth/sessions/{sid}/revoke', async () => {
        const params = { sid: 'sid-2' };
        await service.revoke(params);

        expect(mockDelete).toHaveBeenCalledWith({
            path: '/api/auth/sessions/sid-2/revoke',
            options: { responseType: 'json', requestFormat: 'json' },
            bshOptions: params,
            entity: CoreEntities.BshAuthSessions,
            api: 'auth-sessions.revoke',
        });
    });

    it('search should POST the search payload to /api/auth/sessions/search', async () => {
        const params = { payload: { filters: [{ field: 'status', operator: 'eq', value: 'Active' }] } } as any;
        await service.search(params);

        expect(mockPost).toHaveBeenCalledWith({
            path: '/api/auth/sessions/search',
            options: {
                responseType: 'json',
                requestFormat: 'json',
                body: params.payload,
                headers: { 'Content-Type': 'application/json' },
            },
            bshOptions: params,
            entity: CoreEntities.BshAuthSessions,
            api: 'auth-sessions.search',
        });
    });

    it('list should GET /api/auth/sessions with query params', async () => {
        await service.list({ queryParams: { page: '0', size: '10', sort: 'iat:desc', filter: 'status:eq:Active' } });

        expect(mockGet).toHaveBeenCalledWith(expect.objectContaining({
            path: '/api/auth/sessions?page=0&size=10&sort=iat%3Adesc&filter=status%3Aeq%3AActive',
            api: 'auth-sessions.list',
        }));
    });

    it('list should GET /api/auth/sessions without query params', async () => {
        await service.list({});

        expect(mockGet).toHaveBeenCalledWith(expect.objectContaining({ path: '/api/auth/sessions' }));
    });

    it('count should GET /api/auth/sessions/count', async () => {
        await service.count({});

        expect(mockGet).toHaveBeenCalledWith(expect.objectContaining({
            path: '/api/auth/sessions/count',
            api: 'auth-sessions.count',
        }));
    });

    it('countFiltered should POST /api/auth/sessions/count', async () => {
        const params = { payload: {} } as any;
        await service.countFiltered(params);

        expect(mockPost).toHaveBeenCalledWith(expect.objectContaining({
            path: '/api/auth/sessions/count',
            api: 'auth-sessions.countFiltered',
        }));
    });
});
