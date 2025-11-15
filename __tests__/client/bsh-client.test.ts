import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BshClient } from '@src/client/bsh-client';
import type { BshClientFn, BshAuthFn } from '@src/client/types';
import { BshError } from '@types';

describe('BshClient', () => {
  let mockHttpClient: BshClientFn;
  let mockAuthFn: BshAuthFn;
  let client: BshClient;
  const host = 'http://localhost:3000';

  beforeEach(() => {
    mockHttpClient = vi.fn();
    mockAuthFn = vi.fn().mockResolvedValue({ type: 'JWT', token: 'test-jwt-token' });
    client = new BshClient(host, mockHttpClient, mockAuthFn);
  });

  describe('constructor', () => {
    it('should create client without authFn', () => {
      const clientWithoutAuth = new BshClient(host, mockHttpClient);
      expect(clientWithoutAuth).toBeDefined();
    });

    it('should create client with authFn', () => {
      expect(client).toBeDefined();
    });
  });

  describe('get', () => {
    it('should make GET request with JWT auth', async () => {
      const mockResponse = new Response(JSON.stringify({ data: [], code: 200, status: 'OK', error: '' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockHttpClient = vi.fn().mockResolvedValue(mockResponse);
      client = new BshClient(host, mockHttpClient, mockAuthFn);

      const result = await client.get({
        path: '/api/test',
        options: {},
        bshOptions: {},
      });

      expect(mockHttpClient).toHaveBeenCalledWith({
        path: 'http://localhost:3000/api/test',
        options: {
          method: 'GET',
          headers: {
            Authorization: 'Bearer test-jwt-token',
          },
        },
        bshOptions: {},
      });
      expect(result).toBeDefined();
    });

    it('should make GET request with APIKEY auth', async () => {
      const apiKeyAuthFn: BshAuthFn = vi.fn().mockResolvedValue({ type: 'APIKEY', token: 'test-api-key' });
      const mockResponse = new Response(JSON.stringify({ data: [], code: 200, status: 'OK', error: '' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockHttpClient = vi.fn().mockResolvedValue(mockResponse);
      client = new BshClient(host, mockHttpClient, apiKeyAuthFn);

      await client.get({
        path: '/api/test',
        options: {},
        bshOptions: {},
      });

      expect(mockHttpClient).toHaveBeenCalledWith({
        path: 'http://localhost:3000/api/test',
        options: {
          method: 'GET',
          headers: {
            'X-BSH-APIKEY': 'test-api-key',
          },
        },
        bshOptions: {},
      });
    });

    it('should handle onSuccess callback', async () => {
      const mockData = { data: [{ id: '1' }], code: 200, status: 'OK', error: '' };
      const mockResponse = new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockHttpClient = vi.fn().mockResolvedValue(mockResponse);
      client = new BshClient(host, mockHttpClient, mockAuthFn);

      const onSuccess = vi.fn();
      const result = await client.get({
        path: '/api/test',
        options: {},
        bshOptions: { onSuccess },
      });

      expect(onSuccess).toHaveBeenCalledWith(mockData);
      expect(result).toBeUndefined();
    });

    it('should handle onError callback', async () => {
      const mockErrorData = { data: [], code: 404, status: 'Not Found', error: 'Resource not found' };
      const mockResponse = new Response(JSON.stringify(mockErrorData), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
      mockHttpClient = vi.fn().mockResolvedValue(mockResponse);
      client = new BshClient(host, mockHttpClient, mockAuthFn);

      const onError = vi.fn();
      const result = await client.get({
        path: '/api/test',
        options: {},
        bshOptions: { onError },
      });

      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0]).toBeInstanceOf(BshError);
      expect(result).toBeUndefined();
    });

    it('should throw error when no onError callback', async () => {
      const mockErrorData = { data: [], code: 500, status: 'Error', error: 'Server error' };
      const mockResponse = new Response(JSON.stringify(mockErrorData), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
      mockHttpClient = vi.fn().mockResolvedValue(mockResponse);
      client = new BshClient(host, mockHttpClient, mockAuthFn);

      await expect(
        client.get({
          path: '/api/test',
          options: {},
          bshOptions: {},
        })
      ).rejects.toThrow(BshError);
    });

    it('should merge custom headers', async () => {
      const mockResponse = new Response(JSON.stringify({ data: [], code: 200, status: 'OK', error: '' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockHttpClient = vi.fn().mockResolvedValue(mockResponse);
      client = new BshClient(host, mockHttpClient, mockAuthFn);

      await client.get({
        path: '/api/test',
        options: {
          headers: {
            'Custom-Header': 'custom-value',
          },
        },
        bshOptions: {},
      });

      expect(mockHttpClient).toHaveBeenCalledWith({
        path: 'http://localhost:3000/api/test',
        options: {
          method: 'GET',
          headers: {
            'Custom-Header': 'custom-value',
            Authorization: 'Bearer test-jwt-token',
          },
        },
        bshOptions: {},
      });
    });
  });

  describe('post', () => {
    it('should make POST request with body', async () => {
      const mockData = { data: [{ id: '1' }], code: 201, status: 'Created', error: '' };
      const mockResponse = new Response(JSON.stringify(mockData), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
      mockHttpClient = vi.fn().mockResolvedValue(mockResponse);
      client = new BshClient(host, mockHttpClient, mockAuthFn);

      const body = { name: 'Test' };
      await client.post({
        path: '/api/test',
        options: { body },
        bshOptions: {},
      });

      expect(mockHttpClient).toHaveBeenCalledWith({
        path: 'http://localhost:3000/api/test',
        options: {
          method: 'POST',
          body,
          headers: {
            Authorization: 'Bearer test-jwt-token',
          },
        },
        bshOptions: {},
      });
    });
  });

  describe('put', () => {
    it('should make PUT request with body', async () => {
      const mockData = { data: [{ id: '1' }], code: 200, status: 'OK', error: '' };
      const mockResponse = new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockHttpClient = vi.fn().mockResolvedValue(mockResponse);
      client = new BshClient(host, mockHttpClient, mockAuthFn);

      const body = { id: '1', name: 'Updated' };
      await client.put({
        path: '/api/test',
        options: { body },
        bshOptions: {},
      });

      expect(mockHttpClient).toHaveBeenCalledWith({
        path: 'http://localhost:3000/api/test',
        options: {
          method: 'PUT',
          body,
          headers: {
            Authorization: 'Bearer test-jwt-token',
          },
        },
        bshOptions: {},
      });
    });
  });

  describe('delete', () => {
    it('should make DELETE request', async () => {
      const mockData = { data: [], code: 200, status: 'OK', error: '' };
      const mockResponse = new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockHttpClient = vi.fn().mockResolvedValue(mockResponse);
      client = new BshClient(host, mockHttpClient, mockAuthFn);

      await client.delete({
        path: '/api/test/1',
        options: {},
        bshOptions: {},
      });

      expect(mockHttpClient).toHaveBeenCalledWith({
        path: 'http://localhost:3000/api/test/1',
        options: {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer test-jwt-token',
          },
        },
        bshOptions: {},
      });
    });
  });

  describe('patch', () => {
    it('should make PATCH request with body', async () => {
      const mockData = { data: [{ id: '1' }], code: 200, status: 'OK', error: '' };
      const mockResponse = new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockHttpClient = vi.fn().mockResolvedValue(mockResponse);
      client = new BshClient(host, mockHttpClient, mockAuthFn);

      const body = { name: 'Patched' };
      await client.patch({
        path: '/api/test/1',
        options: { body },
        bshOptions: {},
      });

      expect(mockHttpClient).toHaveBeenCalledWith({
        path: 'http://localhost:3000/api/test/1',
        options: {
          method: 'PATCH',
          body,
          headers: {
            Authorization: 'Bearer test-jwt-token',
          },
        },
        bshOptions: {},
      });
    });
  });

  describe('download', () => {
    it('should download blob', async () => {
      const mockBlob = new Blob(['test content'], { type: 'application/pdf' });
      const mockResponse = new Response(mockBlob, {
        status: 200,
        headers: { 'Content-Type': 'application/pdf' },
      });
      mockHttpClient = vi.fn().mockResolvedValue(mockResponse);
      client = new BshClient(host, mockHttpClient, mockAuthFn);

      const result = await client.download({
        path: '/api/test/download',
        options: {},
        bshOptions: {},
      });

      expect(mockHttpClient).toHaveBeenCalledWith({
        path: 'http://localhost:3000/api/test/download',
        options: {
          headers: {
            Authorization: 'Bearer test-jwt-token',
          },
        },
        bshOptions: {},
      });
      expect(result).toBeInstanceOf(Blob);
    });

    it('should handle onDownload callback', async () => {
      const mockBlob = new Blob(['test content'], { type: 'application/pdf' });
      const mockResponse = new Response(mockBlob, {
        status: 200,
        headers: { 'Content-Type': 'application/pdf' },
      });
      mockHttpClient = vi.fn().mockResolvedValue(mockResponse);
      client = new BshClient(host, mockHttpClient, mockAuthFn);

      const onDownload = vi.fn();
      const result = await client.download({
        path: '/api/test/download',
        options: {},
        bshOptions: { onDownload },
      });

      expect(onDownload).toHaveBeenCalledWith(mockBlob);
      expect(result).toBeUndefined();
    });
  });

  describe('auth handling', () => {
    it('should work without authFn', async () => {
      const mockResponse = new Response(JSON.stringify({ data: [], code: 200, status: 'OK', error: '' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockHttpClient = vi.fn().mockResolvedValue(mockResponse);
      const clientWithoutAuth = new BshClient(host, mockHttpClient);

      await clientWithoutAuth.get({
        path: '/api/test',
        options: {},
        bshOptions: {},
      });

      expect(mockHttpClient).toHaveBeenCalledWith({
        path: 'http://localhost:3000/api/test',
        options: {
          method: 'GET',
          headers: {},
        },
        bshOptions: {},
      });
    });
  });
});

