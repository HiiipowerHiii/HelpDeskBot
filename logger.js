const fs = require('fs');
const path = require('path');
const winston = require('winston');
require('dotenv').config();
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const envLoglevel = process.env.LOG_LEVEL || 'info';
const logFilename = process.env.LOG_FILE || 'application.log';
const logger = winston.createLogger({
  level: envLoglevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: path.join(logDir, logFilename) })
  ]
});
function logMessage(level, message) {
  logger.log({
    level: level,
    message: message
  });
}
module.exports = {
  logMessage
};