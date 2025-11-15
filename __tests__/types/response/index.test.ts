import { describe, it, expect } from 'vitest';
import { BshError, BshResponse, isOk } from '@types';

describe('BshResponse', () => {
  describe('isOk', () => {
    it('should return true for 2xx status codes', () => {
      const response: BshResponse<unknown> = {
        data: [],
        code: 200,
        status: 'OK',
        error: '',
        timestamp: Date.now(),
      };
      expect(isOk(response)).toBe(true);

      const response201: BshResponse<unknown> = {
        data: [],
        code: 201,
        status: 'Created',
        error: '',
        timestamp: Date.now(),
      };
      expect(isOk(response201)).toBe(true);

      const response299: BshResponse<unknown> = {
        data: [],
        code: 299,
        status: 'Success',
        error: '',
        timestamp: Date.now(),
      };
      expect(isOk(response299)).toBe(true);
    });

    it('should return false for non-2xx status codes', () => {
      const response400: BshResponse<unknown> = {
        data: [],
        code: 400,
        status: 'Bad Request',
        error: 'Invalid input',
        timestamp: Date.now(),
      };
      expect(isOk(response400)).toBe(false);

      const response404: BshResponse<unknown> = {
        data: [],
        code: 404,
        status: 'Not Found',
        error: 'Resource not found',
        timestamp: Date.now(),
      };
      expect(isOk(response404)).toBe(false);

      const response500: BshResponse<unknown> = {
        data: [],
        code: 500,
        status: 'Internal Server Error',
        error: 'Server error',
        timestamp: Date.now(),
      };
      expect(isOk(response500)).toBe(false);
    });

    it('should handle responses with pagination', () => {
      const response: BshResponse<unknown> = {
        data: [{ id: '1' }, { id: '2' }],
        code: 200,
        status: 'OK',
        error: '',
        timestamp: Date.now(),
        pagination: {
          current: 1,
          total: 10,
          pages: 5,
          first: true,
          last: false,
        },
      };
      expect(isOk(response)).toBe(true);
    });

    it('should handle responses with meta information', () => {
      const response: BshResponse<unknown> = {
        data: [],
        code: 200,
        status: 'OK',
        error: '',
        timestamp: Date.now(),
        meta: {
          sql: 'SELECT * FROM table',
          error: '',
        },
      };
      expect(isOk(response)).toBe(true);
    });

    it('should handle responses with validations', () => {
      const response: BshResponse<unknown> = {
        data: [],
        code: 400,
        status: 'Bad Request',
        error: 'Validation failed',
        timestamp: Date.now(),
        validations: [
          { field: 'email', error: 'Invalid email format' },
          { field: 'name', error: 'Name is required' },
        ],
      };
      expect(isOk(response)).toBe(false);
    });
  });
});

describe('BshError', () => {
  it('should create error with status and endpoint', () => {
    const error = new BshError(404, '/api/test');
    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(404);
    expect(error.endpoint).toBe('/api/test');
    expect(error.name).toBe('BshError');
  });

  it('should create error with response object', () => {
    const response: BshResponse<unknown> = {
      data: [],
      code: 404,
      status: 'Not Found',
      error: 'Resource not found',
      timestamp: Date.now(),
    };
    const error = new BshError(404, '/api/test', response);
    expect(error.status).toBe(404);
    expect(error.endpoint).toBe('/api/test');
    expect(error.response).toBe(response);
    expect(error.response?.endpoint).toBe('/api/test');
  });

  it('should set endpoint on response if provided', () => {
    const response: BshResponse<unknown> = {
      data: [],
      code: 500,
      status: 'Error',
      error: 'Server error',
      timestamp: Date.now(),
    };
    const endpoint = '/api/entities/TestEntity';
    const error = new BshError(500, endpoint, response);
    expect(error.response?.endpoint).toBe(endpoint);
  });

  it('should create error message from response JSON', () => {
    const response: BshResponse<unknown> = {
      data: [],
      code: 400,
      status: 'Bad Request',
      error: 'Invalid input',
      timestamp: Date.now(),
    };
    const error = new BshError(400, '/api/test', response);
    expect(error.message).toContain('Bad Request');
    expect(error.message).toContain('Invalid input');
  });

  it('should handle error without response', () => {
    const error = new BshError(500, '/api/test');
    expect(error.status).toBe(500);
    expect(error.endpoint).toBe('/api/test');
    expect(error.response).toBeUndefined();
  });

  it('should be throwable', () => {
    const error = new BshError(404, '/api/test');
    expect(() => {
      throw error;
    }).toThrow(BshError);
  });

  it('should preserve error details when thrown', () => {
    const response: BshResponse<unknown> = {
      data: [],
      code: 403,
      status: 'Forbidden',
      error: 'Access denied',
      timestamp: Date.now(),
    };
    const error = new BshError(403, '/api/protected', response);

    try {
      throw error;
    } catch (e) {
      expect(e).toBeInstanceOf(BshError);
      if (e instanceof BshError) {
        expect(e.status).toBe(403);
        expect(e.endpoint).toBe('/api/protected');
        expect(e.response).toBe(response);
      }
    }
  });
});

