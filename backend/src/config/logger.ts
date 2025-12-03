import fs from 'fs';
import winston from 'winston';

// Create logs directory if it doesn't exist
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Define the log format
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
    })
);

// Create the logger
const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        // Console output
        new winston.transports.Console(),
        // File output
        new winston.transports.File({ filename: `${logDir}/combined.log` }),
        new winston.transports.File({ filename: `${logDir}/error.log`, level: 'error' }),
    ],
});

// Export the logger
export default logger;

// Example usage:
// logger.info('Information message');
// logger.error('Error message');
// logger.warn('Warning message');
// logger.debug('Debug message');
