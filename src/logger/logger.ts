import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // 콘솔 출력
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // 에러 로그 파일
    new transports.File({ filename: 'logs/combined.log' }), // 전체 로그 파일
  ],
});

export default logger;
