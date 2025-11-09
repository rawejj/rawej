import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { saveToken, loadToken, clearToken, type TokenData } from './token-storage';

vi.mock('fs', () => {
  const actual = vi.importActual<typeof import('fs')>('fs');
  return {
    default: {
      ...actual,
      existsSync: vi.fn(actual!.existsSync),
      mkdirSync: vi.fn(actual!.mkdirSync),
      writeFileSync: vi.fn(actual!.writeFileSync),
      readFileSync: vi.fn(actual!.readFileSync),
      unlinkSync: vi.fn(actual!.unlinkSync),
    },
  };
});

vi.mock('path', () => {
  const actual = vi.importActual<typeof import('path')>('path');
  return {
    default: {
      ...actual,
      resolve: vi.fn(actual!.resolve),
      dirname: vi.fn(actual!.dirname),
    },
  };
});

describe('token-storage', () => {
  const mockTokenData: TokenData = {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    expiresAt: Date.now() + 3600000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveToken', () => {
    it('saves token data', () => {
      saveToken(mockTokenData);
      expect(vi.mocked(fs.writeFileSync)).toHaveBeenCalled();
    });

    it('writes token as JSON', () => {
      saveToken(mockTokenData);
      const calls = vi.mocked(fs.writeFileSync).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      const content = calls[0][1];
      const parsed = JSON.parse(content as string);
      expect(parsed.accessToken).toBe(mockTokenData.accessToken);
    });

    it('uses utf8 encoding', () => {
      saveToken(mockTokenData);
      const calls = vi.mocked(fs.writeFileSync).mock.calls;
      expect(calls[0][2]).toBe('utf8');
    });
  });

  describe('loadToken', () => {
    it('returns token when file exists', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockTokenData));

      const result = loadToken();

      expect(result).toEqual(mockTokenData);
    });

    it('returns null when file does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const result = loadToken();

      expect(result).toBeNull();
    });

    it('returns null on invalid JSON', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('invalid json');

      const result = loadToken();

      expect(result).toBeNull();
    });

    it('uses utf8 encoding', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockTokenData));

      loadToken();

      const calls = vi.mocked(fs.readFileSync).mock.calls;
      expect(calls[0][1]).toBe('utf8');
    });

    it('returns null on read error', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw new Error('Read failed');
      });

      const result = loadToken();

      expect(result).toBeNull();
    });

    it('preserves token structure', () => {
      const token: TokenData = {
        accessToken: 'access-123',
        refreshToken: 'refresh-456',
        expiresAt: 1234567890,
      };
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(token));

      const result = loadToken();

      expect(result?.accessToken).toBe('access-123');
      expect(result?.refreshToken).toBe('refresh-456');
      expect(result?.expiresAt).toBe(1234567890);
    });
  });

  describe('clearToken', () => {
    it('calls unlinkSync when file exists', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);

      clearToken();

      expect(vi.mocked(fs.unlinkSync)).toHaveBeenCalled();
    });

    it('does not call unlinkSync when file does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      clearToken();

      expect(vi.mocked(fs.unlinkSync)).not.toHaveBeenCalled();
    });
  });
});
