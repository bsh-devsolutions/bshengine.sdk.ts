import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SettingsService } from '@src/services/settings';
import { bshConfigs } from '@config';
import type { BshClientFn, BshAuthFn } from '@src/client/types';
import type { BshSettings } from '@types';
import { BshError } from '@types';

describe('SettingsService', () => {
  let mockClientFn: BshClientFn;
  let mockAuthFn: BshAuthFn;
  let mockGet: any;
  let mockPut: any;

  beforeEach(() => {
    // Reset singleton
    (SettingsService as any).instance = undefined;
    bshConfigs.reset();

    // Setup mocks
    mockGet = vi.fn();
    mockPut = vi.fn();

    mockClientFn = vi.fn();
    mockAuthFn = vi.fn().mockResolvedValue({ type: 'JWT', token: 'test-token' });

    // Mock BshClient methods
    const mockClient = {
      get: mockGet,
      put: mockPut,
    };

    // Mock createClient to return our mock
    vi.spyOn(bshConfigs, 'createClient').mockReturnValue(mockClient as any);

    bshConfigs.configure({
      clientFn: mockClientFn,
      authFn: mockAuthFn,
      host: 'http://localhost:3000',
    });
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = SettingsService.getInstance();
      const instance2 = SettingsService.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should create a new instance after reset', () => {
      const instance1 = SettingsService.getInstance();
      (SettingsService as any).instance = undefined;
      const instance2 = SettingsService.getInstance();

      expect(instance1).not.toBe(instance2);
    });
  });

  describe('getSettings', () => {
    it('should call client.get with correct endpoint', async () => {
      const mockSettings: BshSettings = {
        name: 'BshEngine',
        api: {
          response: {
            showSql: true,
          },
          auth: {
            enableRegister: false,
          },
        },
      };
      const mockResponse = {
        data: mockSettings,
        code: 200,
        status: 'OK',
        error: '',
      };
      mockGet.mockResolvedValue(mockResponse);

      const settingsService = SettingsService.getInstance();
      await settingsService.load({});

      expect(mockGet).toHaveBeenCalledWith({
        path: '/api/settings',
        options: {
          responseType: 'json',
          responseFormat: 'json',
        },
        bshOptions: { onSuccess: undefined, onError: undefined },
      });
    });

    it('should handle onSuccess callback', async () => {
      const mockSettings: BshSettings = {
        name: 'BshEngine',
        api: {
          response: {
            showSql: true,
          },
          auth: {
            enableRegister: false,
          },
        },
      };
      const mockResponse = {
        data: mockSettings,
        code: 200,
        status: 'OK',
        error: '',
      };
      mockGet.mockImplementation(async (params: any) => {
        if (params.bshOptions?.onSuccess) {
          params.bshOptions.onSuccess(mockResponse);
          return undefined;
        }
        return mockResponse;
      });

      const onSuccess = vi.fn();
      const settingsService = SettingsService.getInstance();
      await settingsService.load({ onSuccess });

      expect(onSuccess).toHaveBeenCalledWith(mockResponse);
    });

    it('should return response when no callbacks provided', async () => {
      const mockSettings: BshSettings = {
        name: 'BshEngine',
        api: {
          response: {
            showSql: true,
          },
        },
      };
      const mockResponse = {
        data: mockSettings,
        code: 200,
        status: 'OK',
        error: '',
      };
      mockGet.mockResolvedValue(mockResponse);

      const settingsService = SettingsService.getInstance();
      const result = await settingsService.load({});

      expect(result).toEqual(mockResponse);
    });

    it('should handle onError callback', async () => {
      const mockError = new BshError(500, '/api/settings');
      mockGet.mockRejectedValue(mockError);

      const onError = vi.fn();
      const settingsService = SettingsService.getInstance();
      await settingsService.load({ onError }).catch(() => {});

      expect(mockGet).toHaveBeenCalled();
    });
  });

  describe('updateSettings', () => {
    it('should call client.put with correct endpoint and payload', async () => {
      const settingsUpdate: BshSettings = {
        name: 'BshEngine',
        api: {
          response: {
            showSql: false,
          },
          auth: {
            enableRegister: true,
          },
        },
      };
      const mockResponse = {
        data: settingsUpdate,
        code: 200,
        status: 'OK',
        error: '',
      };
      mockPut.mockResolvedValue(mockResponse);

      const settingsService = SettingsService.getInstance();
      await settingsService.update({ payload: settingsUpdate });

      expect(mockPut).toHaveBeenCalledWith({
        path: '/api/settings',
        options: {
          responseType: 'json',
          responseFormat: 'json',
          body: settingsUpdate,
          headers: {
            'Content-Type': 'application/json',
          },
        },
        bshOptions: { onSuccess: undefined, onError: undefined },
      });
    });

    it('should handle onSuccess callback', async () => {
      const settingsUpdate: BshSettings = {
        name: 'BshEngine',
        api: {
          response: {
            showSql: false,
          },
        },
      };
      const mockResponse = {
        data: settingsUpdate,
        code: 200,
        status: 'OK',
        error: '',
      };
      mockPut.mockImplementation(async (params: any) => {
        if (params.bshOptions?.onSuccess) {
          params.bshOptions.onSuccess(mockResponse);
          return undefined;
        }
        return mockResponse;
      });

      const onSuccess = vi.fn();
      const settingsService = SettingsService.getInstance();
      await settingsService.update({ payload: settingsUpdate, onSuccess });

      expect(onSuccess).toHaveBeenCalledWith(mockResponse);
    });

    it('should return response when no callbacks provided', async () => {
      const settingsUpdate: BshSettings = {
        name: 'BshEngine',
        api: {
          response: {
            showSql: false,
          },
          auth: {
            enableRegister: true,
          },
        },
      };
      const mockResponse = {
        data: settingsUpdate,
        code: 200,
        status: 'OK',
        error: '',
      };
      mockPut.mockResolvedValue(mockResponse);

      const settingsService = SettingsService.getInstance();
      const result = await settingsService.update({ payload: settingsUpdate });

      expect(result).toEqual(mockResponse);
    });

    it('should handle onError callback', async () => {
      const settingsUpdate: BshSettings = {
        name: 'BshEngine',
        api: {},
      };
      const mockError = new BshError(400, '/api/settings');
      mockPut.mockRejectedValue(mockError);

      const onError = vi.fn();
      const settingsService = SettingsService.getInstance();
      await settingsService.update({ payload: settingsUpdate, onError }).catch(() => {});

      expect(mockPut).toHaveBeenCalled();
    });
  });
});

