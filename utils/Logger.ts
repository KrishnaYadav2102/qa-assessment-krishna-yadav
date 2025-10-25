import * as winston from 'winston'; // Import the Winston logging library

// Define log colors for the console
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  // Custom format outputting: TIMESTAMP [LEVEL]: MESSAGE
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info', // Default minimum log level for filtering messages across all transports
  format: winston.format.combine(
    // Global format to ensure a consistent timestamp for all transports
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss,SSS' }),
    logFormat, // Apply the custom display format defined above
  ),
  transports: [
    // 1. Console Transport (Colored for easy readability)
    new winston.transports.Console({
      // Separate format for the console to enable text coloring
      format: winston.format.combine(
        winston.format.colorize(), // Add ANSI colors to log level names
        // winston.format.simple(), // This line is commented out, preserving custom format
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss,SSS' }),
      ),
    }),
    // 2. File Transport (For permanent record, especially for errors)
    new winston.transports.File({
      filename: 'test-failures.log', // Log file for critical errors
      level: 'error', // Only log messages with level 'error' and above to this file
    }),
    new winston.transports.File({ filename: 'test-combined.log' }), // Log file for all 'info' level messages and above
  ],
});

/**
 * Utility class to provide a standardized logger across the framework.
 * This class wraps the Winston logger for easy use (e.g., Logger.info('...')).
 * It uses static methods for direct, global access.
 */
export class Logger {
  // Public static method for standard informational logging
  public static info(message: string) {
    logger.info(message); // Delegates to the configured Winston logger
  }

  // Public static method for warning messages
  public static warn(message: string) {
    logger.warn(message);
  }

  // Public static method for error messages (will also write to test-failures.log)
  public static error(message: string) {
    logger.error(message);
  }

  // Public static method to visually highlight test steps in the log
  public static step(stepName: string) {
    logger.info(`====> STEP: ${stepName} <====`); // Logs the step as an INFO level message
  }
}
