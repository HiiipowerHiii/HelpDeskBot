const fs = require('fs');
const path = require('path');
const winston = require('winston');
require('dotenv').config();

const logDir = 'logs';

try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
} catch (error) {
  console.error("Failed to create log directory", error);
}

const defaultLogLevel = 'info';
const defaultLogFilename = 'application.log';

const envLoglevel = process.env.LOG_LEVEL || defaultLogLevel;
const logFilename = process.env.LOG_FILE || defaultLogFilename;

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

let transportsArray = [];
try {
  transportsArray = [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: path.join(logDir, logFilename) })
  ];
} catch (error) {
  console.error("Failed to initialize log file transport", error);
}

const logger = winston.createLogger({
  level: envLoglevel,
  format: customFormat,
  transports: transportsArray
});

function logMessage(level, message) {
  try {
    logger.log({
      level,
      message
    });
  } catch (error) {
    console.error("Logging failed", error.message);
  }
}

module.exports = {
  logMessage
};