import { describe, it, expect, beforeEach, vi } from 'vitest';
import { logger } from './logger';

vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('info level', () => {
    it('logs info message', () => {
      logger.info('test info');

      expect(console.log).toHaveBeenCalled();
      const logOutput = vi.mocked(console.log).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData.level).toBe('info');
      expect(logData.message).toBe('test info');
    });

    it('includes timestamp in log output', () => {
      logger.info('test');

      const logOutput = vi.mocked(console.log).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData.timestamp).toBeDefined();
      expect(logData.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('includes context when provided', () => {
      logger.info('test message', 'TestContext');

      const logOutput = vi.mocked(console.log).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData.context).toBe('TestContext');
    });

    it('excludes context when not provided', () => {
      logger.info('test message');

      const logOutput = vi.mocked(console.log).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData.context).toBeUndefined();
    });
  });

  describe('warn level', () => {
    it('logs warn message', () => {
      logger.warn('test warning');

      expect(console.warn).toHaveBeenCalled();
      const logOutput = vi.mocked(console.warn).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData.level).toBe('warn');
      expect(logData.message).toBe('test warning');
    });

    it('logs warn with context', () => {
      logger.warn('test warning', 'MyContext');

      const logOutput = vi.mocked(console.warn).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData.context).toBe('MyContext');
    });
  });

  describe('error level', () => {
    it('logs error with context', () => {
      logger.error('error message', 'ErrorContext');

      const logOutput = vi.mocked(console.error).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData.context).toBe('ErrorContext');
    });

    it('logs Error object with stack trace', () => {
      const error = new Error('Test error');
      logger.error(error);

      expect(console.error).toHaveBeenCalled();
      const logOutput = vi.mocked(console.error).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData.message).toContain('Test error');
      expect(logData.message).toContain('Stack:');
    });

    it('handles non-Error objects by stringifying', () => {
      const errorObj = { code: 'ERR_CODE', details: 'error details' };
      logger.error(errorObj);

      expect(console.error).toHaveBeenCalled();
      const logOutput = vi.mocked(console.error).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData.message).toContain('ERR_CODE');
    });
  });

  describe('log structure', () => {
    it('contains required fields', () => {
      logger.info('test message');

      const logOutput = vi.mocked(console.log).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData).toHaveProperty('timestamp');
      expect(logData).toHaveProperty('level');
      expect(logData).toHaveProperty('message');
    });

    it('produces valid JSON output', () => {
      logger.warn('test warning');

      const logOutput = vi.mocked(console.warn).mock.calls[0][0];
      expect(() => JSON.parse(logOutput as string)).not.toThrow();
    });

    it('includes all provided data fields', () => {
      logger.error('error with context', 'TestContext');

      const logOutput = vi.mocked(console.error).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(Object.keys(logData)).toContain('timestamp');
      expect(Object.keys(logData)).toContain('level');
      expect(Object.keys(logData)).toContain('message');
      expect(Object.keys(logData)).toContain('context');
    });
  });

  describe('console methods', () => {
    it('uses console.log for info messages', () => {
      logger.info('info msg');
      expect(console.log).toHaveBeenCalled();
    });

    it('uses console.warn for warn messages', () => {
      logger.warn('warn msg');
      expect(console.warn).toHaveBeenCalled();
    });

    it('uses console.error for error messages', () => {
      logger.error('error msg');
      expect(console.error).toHaveBeenCalled();
    });

    it('all logs are JSON formatted', () => {
      logger.info('info');
      logger.warn('warn');
      logger.error('error');

      [console.log, console.warn, console.error].forEach(fn => {
        const calls = vi.mocked(fn).mock.calls;
        calls.forEach(call => {
          expect(() => JSON.parse(call[0] as string)).not.toThrow();
        });
      });
    });
  });

  describe('message handling', () => {
    it('preserves simple string messages', () => {
      logger.info('hello world');

      const logOutput = vi.mocked(console.log).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData.message).toBe('hello world');
    });

    it('includes messages from Error objects', () => {
      const error = new Error('Something went wrong');
      logger.error(error);

      const logOutput = vi.mocked(console.error).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData.message).toContain('Something went wrong');
    });

    it('handles messages with special characters', () => {
      logger.info('Message with "quotes" and \\backslashes\\');

      const logOutput = vi.mocked(console.log).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData.message).toContain('quotes');
    });
  });

  describe('context handling', () => {
    it('adds context when provided', () => {
      logger.info('message', 'MyContext');

      const logOutput = vi.mocked(console.log).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect(logData.context).toBe('MyContext');
    });

    it('omits context field when not provided', () => {
      logger.warn('warning without context');

      const logOutput = vi.mocked(console.warn).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect('context' in logData).toBeFalsy();
    });

    it('omits context when empty string is provided', () => {
      logger.error('error', '');

      const logOutput = vi.mocked(console.error).mock.calls[0][0];
      const logData = JSON.parse(logOutput as string);
      expect('context' in logData).toBeFalsy();
    });
  });
});
