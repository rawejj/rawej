// src/utils/logger.ts
import fs from 'fs';
import path from 'path';

/**
 * Logger utility with configurable log levels and file output
 * Supports: debug, info, warn, error
 * Configure via environment variables:
 * - LOG_LEVEL: minimum level to log (default: 'info')
 * - LOG_TO_FILE: enable file logging (default: 'false')
 * - LOG_FILE_PATH: file path for logs (default: './logs/app.log')
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
const logToFile = process.env.LOG_TO_FILE === 'true';
const logFilePath = process.env.LOG_FILE_PATH || './storage/logs/app.log';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
}

function writeLog(level: LogLevel, message: string, context?: string) {
  if (!shouldLog(level)) return;

  const timestamp = new Date().toISOString();
  const logEntry: Record<string, unknown> = {
    timestamp,
    level,
    message,
  };
  if (context) logEntry.context = context;

  const logMessage = JSON.stringify(logEntry);

  // Console output
  const consoleFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  consoleFn(logMessage);

  // File output
  if (logToFile) {
    try {
      // Use date-based log file: e.g., app-2025-11-08.log
      const dir = path.dirname(logFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const ext = path.extname(logFilePath);
      const base = path.basename(logFilePath, ext);
      const dateStr = timestamp.slice(0, 10); // YYYY-MM-DD
      const datedLogFile = path.join(dir, `${base}-${dateStr}${ext}`);
      fs.appendFileSync(datedLogFile, logMessage + '\n', 'utf8');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }
}

class Logger {
  debug(message: string, context?: string) {
    writeLog('debug', message, context);
  }

  info(message: string, context?: string) {
    writeLog('info', message, context);
  }

  warn(message: string, context?: string) {
    writeLog('warn', message, context);
  }

  error(error: unknown, context?: string) {
    let message = '';
    if (error instanceof Error) {
      message = error.message;
      if (error.stack) message += `\nStack: ${error.stack}`;
    } else {
      message = JSON.stringify(error);
    }
    writeLog('error', message, context);
  }
}

export const logger = new Logger();
