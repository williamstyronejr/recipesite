import { createLogger, format, Logger, transports } from 'winston';

const { NODE_ENV } = process.env;

let logger: Logger;

if (NODE_ENV === 'development') {
  const devFormatting = format.printf(
    ({ level, message, timestamp, stack }) => {
      return `${timestamp} ${level}: ${stack || message}`;
    },
  );

  logger = createLogger({
    level: 'debug',
    defaultMeta: { service: 'web-service' },
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      devFormatting,
    ),
    transports: [new transports.Console()],
  });
} else {
  logger = createLogger({
    level: 'info',
    defaultMeta: { service: 'web-service' },
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.json(),
    ),
    transports: [new transports.Console()],
  });
}

export default logger;
