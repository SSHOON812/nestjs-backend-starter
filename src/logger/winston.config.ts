import * as winston from 'winston';
import 'winston-daily-rotate-file';


const { combine, timestamp, printf, colorize } = winston.format;

const logformat = printf((
    { level, message, timestamp, context }) => {

    return `${timestamp} [${level}] ${context || 'App'} - ${message}`;

});


export const winstonConfig = {
    transports: [
        // console log
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                logformat,
            ),
        }),

        // 일반 로그 
        new winston.transports.DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            level: 'info',
            format: combine(timestamp(), logformat),
        }),

        // 에러 로그 
        new winston.transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d',
            level: 'error',
            format: combine(timestamp(), logformat),
        }),
    ]
}