const fs = require('fs');
const path = require('path');
const winston = require('winston');
require('dotenv').config();

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const defaultLogLevel = 'info';
const defaultLogFilename = 'application.log';

const envLoglevel = process.env.LOG_LEVEL || defaultLogLevel;
const logFilename = process.env.LOG_FILE || defaultLogFilename;

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = winston.createLogger({
  level: envLoglevel,
  format: customFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }), 
    new winston.transports.File({ filename: path.join(logDir, logFilename) })
  ]
});

function logMessage(level, message) {
  logger.log({
    level,
    message
  });
}

module.exports = {
  logMessage
};