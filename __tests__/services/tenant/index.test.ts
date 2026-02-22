import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TenantService } from '@src/services';
import { BshClient } from '@client';
import { BshTenant, BshTenantPure, BshSearch } from '@types';
import { CoreEntities } from '@types';

describe('TenantService', () => {
    let tenantService: TenantService;
    let mockClient: BshClient;
    let mockGet: ReturnType<typeof vi.fn>;
    let mockPost: ReturnType<typeof vi.fn>;
    let mockPut: ReturnType<typeof vi.fn>;
    let mockDelete: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockGet = vi.fn();
        mockPost = vi.fn();
        mockPut = vi.fn();
        mockDelete = vi.fn();
        mockClient = {
            get: mockGet,
            post: mockPost,
            put: mockPut,
            delete: mockDelete,
        } as unknown as BshClient;
        tenantService = new TenantService(mockClient);
    });

    const mockTenant: BshTenant = {
        tenantId: 'tenant-1',
        name: 'Test Tenant',
        status: 'Active',
        persistenceId: 'p-1',
    };

    const mockResponse = {
        data: [mockTenant],
        code: 200,
        status: 'OK',
        error: '',
        timestamp: Date.now()
    };

    describe('create', () => {
        it('should call client.post with correct parameters', async () => {
            mockPost.mockResolvedValue(mockResponse);
            const payload: BshTenantPure = {
                tenantId: 'tenant-1',
                name: 'Test Tenant',
                status: 'Active',
            };
            const params = { payload };

            const result = await tenantService.create(params);

            expect(mockPost).toHaveBeenCalledWith({
                path: '/api/tenants',
                options: {
                    responseType: 'json',
                    requestFormat: 'json',
                    body: payload,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
                bshOptions: params,
                api: 'tenants.create',
                entity: CoreEntities.BshTenants,
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('assignAdmin', () => {
        it('should call client.put with correct parameters', async () => {
            mockPut.mockResolvedValue(mockResponse);
            const params = { id: 'tenant-1', adminId: 'admin-1' };

            const result = await tenantService.assignAdmin(params);

            expect(mockPut).toHaveBeenCalledWith({
                path: '/api/tenants/tenant-1/admin/admin-1',
                options: {
                    responseType: 'json',
                },
                bshOptions: params,
                api: 'tenants.assignAdmin',
                entity: CoreEntities.BshTenants,
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getById', () => {
        it('should call client.get with correct parameters', async () => {
            mockGet.mockResolvedValue(mockResponse);
            const params = { id: 'tenant-1' };

            const result = await tenantService.getById(params);

            expect(mockGet).toHaveBeenCalledWith({
                path: '/api/tenants/tenant-1',
                options: {
                    responseType: 'json',
                },
                bshOptions: params,
                api: 'tenants.getById',
                entity: CoreEntities.BshTenants,
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('search', () => {
        it('should call client.post with correct parameters', async () => {
            mockPost.mockResolvedValue(mockResponse);
            const searchPayload: BshSearch<BshTenant> = { filters: [{  field: "name", value: 'Test', operator: "eq" }] };
            const params = { payload: searchPayload };

            const result = await tenantService.search(params);

            expect(mockPost).toHaveBeenCalledWith({
                path: '/api/tenants/search',
                options: {
                    responseType: 'json',
                    requestFormat: 'json',
                    body: searchPayload,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
                bshOptions: params,
                api: 'tenants.search',
                entity: CoreEntities.BshTenants,
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('list', () => {
        it('should call client.get with correct query parameters', async () => {
            mockGet.mockResolvedValue(mockResponse);
            const params = { page: 1, size: 10, sort: 'name,asc', filter: 'status:Active' };

            const result = await tenantService.list(params);

            expect(mockGet).toHaveBeenCalledWith({
                path: '/api/tenants',
                options: {
                    responseType: 'json',
                    queryParams: {
                        page: '1',
                        size: '10',
                        sort: 'name,asc',
                        filter: 'status:Active',
                    },
                },
                bshOptions: params,
                api: 'tenants.list',
                entity: CoreEntities.BshTenants,
            });
            expect(result).toEqual(mockResponse);
        });

        it('should work without optional parameters', async () => {
            mockGet.mockResolvedValue(mockResponse);
            const params = {};

            await tenantService.list(params);

            expect(mockGet).toHaveBeenCalledWith(expect.objectContaining({
                options: expect.objectContaining({
                    queryParams: {},
                }),
            }));
        });
    });

    describe('update', () => {
        it('should call client.put with correct parameters', async () => {
            mockPut.mockResolvedValue(mockResponse);
            const payload: Partial<BshTenant> = { name: 'Updated Name' };
            const params = { payload };

            const result = await tenantService.update(params);

            expect(mockPut).toHaveBeenCalledWith({
                path: '/api/tenants',
                options: {
                    responseType: 'json',
                    requestFormat: 'json',
                    body: payload,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
                bshOptions: params,
                api: 'tenants.update',
                entity: CoreEntities.BshTenants,
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('delete', () => {
        it('should call client.delete with correct parameters', async () => {
            mockDelete.mockResolvedValue(mockResponse);
            const params = { id: 'tenant-1' };

            const result = await tenantService.delete(params);

            expect(mockDelete).toHaveBeenCalledWith({
                path: '/api/tenants/tenant-1',
                options: {
                    responseType: 'json',
                },
                bshOptions: params,
                api: 'tenants.delete',
                entity: CoreEntities.BshTenants,
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('status actions', () => {
        it('activate should call client.post with correct parameters', async () => {
            mockPost.mockResolvedValue(mockResponse);
            const params = { id: 'tenant-1' };
            const result = await tenantService.activate(params);
            expect(mockPost).toHaveBeenCalledWith(expect.objectContaining({
                path: '/api/tenants/tenant-1/activate',
                api: 'tenants.activate',
            }));
            expect(result).toEqual(mockResponse);
        });

        it('deactivate should call client.post with correct parameters', async () => {
            mockPost.mockResolvedValue(mockResponse);
            const params = { id: 'tenant-1' };
            const result = await tenantService.deactivate(params);
            expect(mockPost).toHaveBeenCalledWith(expect.objectContaining({
                path: '/api/tenants/tenant-1/deactivate',
                api: 'tenants.deactivate',
            }));
            expect(result).toEqual(mockResponse);
        });

        it('block should call client.post with correct parameters', async () => {
            mockPost.mockResolvedValue(mockResponse);
            const params = { id: 'tenant-1' };
            const result = await tenantService.block(params);
            expect(mockPost).toHaveBeenCalledWith(expect.objectContaining({
                path: '/api/tenants/tenant-1/block',
                api: 'tenants.block',
            }));
            expect(result).toEqual(mockResponse);
        });
    });

    describe('count', () => {
        it('count should call client.get with correct parameters', async () => {
            const countResponse = { data: [{ count: 5 }], code: 200, status: 'OK', error: '', timestamp: Date.now() };
            mockGet.mockResolvedValue(countResponse);
            const params = {};

            const result = await tenantService.count(params);

            expect(mockGet).toHaveBeenCalledWith({
                path: '/api/tenants/count',
                options: {
                    responseType: 'json',
                },
                bshOptions: params,
                api: 'tenants.count',
                entity: CoreEntities.BshTenants,
            });
            expect(result).toEqual(countResponse);
        });

        it('countFiltered should call client.post with correct parameters', async () => {
            const countResponse = { data: [{ count: 2 }], code: 200, status: 'OK', error: '', timestamp: Date.now() };
            mockPost.mockResolvedValue(countResponse);
            const searchPayload: BshSearch<BshTenant> = { filters: [{  field: "status", value: 'Active', operator: "eq" }] };
            const params = { payload: searchPayload };

            const result = await tenantService.countFiltered(params);

            expect(mockPost).toHaveBeenCalledWith({
                path: '/api/tenants/count',
                options: {
                    responseType: 'json',
                    requestFormat: 'json',
                    body: searchPayload,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
                bshOptions: params,
                api: 'tenants.countFiltered',
                entity: CoreEntities.BshTenants,
            });
            expect(result).toEqual(countResponse);
        });
    });
});
