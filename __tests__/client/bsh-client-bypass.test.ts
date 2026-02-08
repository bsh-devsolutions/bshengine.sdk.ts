import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BshClient } from '@client';
import { BshPostInterceptor, BshErrorInterceptor, BshPreInterceptor } from '@client';
import { BshResponse } from '@types';
import { BshEngine } from '@src/bshengine';

describe('BshClient Bypass Options', () => {
    let engine: BshEngine;
    let mockHttpClient: ReturnType<typeof vi.fn>;
    let client: BshClient;

    beforeEach(() => {
        engine = new BshEngine();
        mockHttpClient = vi.fn();
        client = new BshClient('https://api.test.com', mockHttpClient, undefined, undefined, engine);
    });

    describe('pre interceptor bypass', () => {
        it('should NOT call pre interceptor when bypass.interceptors.pre is true', async () => {
            const mockData: BshResponse<{ id: number }> = {
                data: [{ id: 1 }],
                code: 200,
                status: 'OK',
                error: '',
                timestamp: Date.now()
            };
            const response = new Response(JSON.stringify(mockData), { status: 200 });
            mockHttpClient.mockResolvedValue(response);
            
            const preInterceptor: BshPreInterceptor = vi.fn().mockImplementation(async (params) => {
                return params;
            });

            engine.preInterceptor(preInterceptor);

            await client.get({
                path: '/test',
                options: {},
                bshOptions: {
                    byPass: {
                        interceptors: {
                            pre: true
                        }
                    }
                }
            });

            expect(preInterceptor).not.toHaveBeenCalled();
            expect(mockHttpClient).toHaveBeenCalled();
        });

        it('should call pre interceptor when bypass.interceptors.pre is false or undefined', async () => {
            const mockData: BshResponse<{ id: number }> = {
                data: [{ id: 1 }],
                code: 200,
                status: 'OK',
                error: '',
                timestamp: Date.now()
            };
            const response = new Response(JSON.stringify(mockData), { status: 200 });
            mockHttpClient.mockResolvedValue(response);
            
            const preInterceptor: BshPreInterceptor = vi.fn().mockImplementation(async (params) => {
                return params;
            });

            engine.preInterceptor(preInterceptor);

            await client.get({
                path: '/test',
                options: {},
                bshOptions: {
                    byPass: {
                        interceptors: {
                            pre: false
                        }
                    }
                }
            });

            expect(preInterceptor).toHaveBeenCalledTimes(1);
        });
    });

    describe('post interceptor bypass', () => {
        it('should NOT call post interceptor when bypass.interceptors.post is true', async () => {
            const mockData: BshResponse<{ id: number }> = {
                data: [{ id: 1 }],
                code: 200,
                status: 'OK',
                error: '',
                timestamp: Date.now()
            };
            const response = new Response(JSON.stringify(mockData), { status: 200 });
            mockHttpClient.mockResolvedValue(response);
            
            const postInterceptor: BshPostInterceptor = vi.fn().mockImplementation(async (result) => {
                return result;
            });

            engine.postInterceptor(postInterceptor);

            await client.get({
                path: '/test',
                options: {},
                bshOptions: {
                    byPass: {
                        interceptors: {
                            post: true
                        }
                    }
                }
            });

            expect(postInterceptor).not.toHaveBeenCalled();
        });

        it('should call post interceptor when bypass.interceptors.post is false or undefined', async () => {
            const mockData: BshResponse<{ id: number }> = {
                data: [{ id: 1 }],
                code: 200,
                status: 'OK',
                error: '',
                timestamp: Date.now()
            };
            const response = new Response(JSON.stringify(mockData), { status: 200 });
            mockHttpClient.mockResolvedValue(response);
            
            const postInterceptor: BshPostInterceptor = vi.fn().mockImplementation(async (result) => {
                return result;
            });

            engine.postInterceptor(postInterceptor);

            await client.get({
                path: '/test',
                options: {},
                bshOptions: {
                    byPass: {
                        interceptors: {
                            post: false
                        }
                    }
                }
            });

            expect(postInterceptor).toHaveBeenCalledTimes(1);
        });
    });

    describe('error interceptor bypass', () => {
        it('should NOT call error interceptor when bypass.interceptors.error is true', async () => {
            const mockError = {
                data: [],
                code: 404,
                status: 'Not Found',
                error: 'Resource not found',
                timestamp: Date.now()
            };
            const response = new Response(JSON.stringify(mockError), { status: 404 });
            mockHttpClient.mockResolvedValue(response);
            
            const errorInterceptor: BshErrorInterceptor = vi.fn().mockImplementation(async (error) => {
                return error;
            });

            engine.errorInterceptor(errorInterceptor);

            const onError = vi.fn();
            await client.get({
                path: '/test',
                options: {},
                bshOptions: {
                    onError,
                    byPass: {
                        interceptors: {
                            error: true
                        }
                    }
                }
            });

            expect(errorInterceptor).not.toHaveBeenCalled();
            expect(onError).toHaveBeenCalled();
        });

        it('should call error interceptor when bypass.interceptors.error is false or undefined', async () => {
            const mockError = {
                data: [],
                code: 404,
                status: 'Not Found',
                error: 'Resource not found',
                timestamp: Date.now()
            };
            const response = new Response(JSON.stringify(mockError), { status: 404 });
            mockHttpClient.mockResolvedValue(response);
            
            const errorInterceptor: BshErrorInterceptor = vi.fn().mockImplementation(async (error) => {
                return error;
            });

            engine.errorInterceptor(errorInterceptor);

            const onError = vi.fn();
            await client.get({
                path: '/test',
                options: {},
                bshOptions: {
                    onError,
                    byPass: {
                        interceptors: {
                            error: false
                        }
                    }
                }
            });

            expect(errorInterceptor).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalled();
        });
    });
});
