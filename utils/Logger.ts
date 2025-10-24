import * as winston from 'winston';

// Define log colors for the console
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info', // Default minimum log level
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss,SSS' }),
    logFormat,
  ),
  transports: [
    // 1. Console Transport (Colored for easy readability)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        // winston.format.simple(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss,SSS' }),
      ),
    }),
    // 2. File Transport (For permanent record, especially for errors)
    new winston.transports.File({
      filename: 'test-failures.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'test-combined.log' }),
  ],
});

/**
 * Utility class to provide a standardized logger across the framework.
 * This class wraps the Winston logger for easy use (e.g., Logger.info('...')).
 */
export class Logger {
  public static info(message: string) {
    logger.info(message);
  }

  public static warn(message: string) {
    logger.warn(message);
  }

  public static error(message: string) {
    logger.error(message);
  }

  public static step(stepName: string) {
    logger.info(`>>>> STEP: ${stepName} <<<<`);
  }
}
