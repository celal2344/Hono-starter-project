import pino from 'pino';
import { env } from '../utils/env.js';

const pinoConfig =
    env.NODE_ENV === 'development'
        ? {
            level: 'debug' as const,
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                },
            },
            formatters: {
                level: (label: string) => {
                    return { level: label.toUpperCase() };
                },
            },
            timestamp: pino.stdTimeFunctions.isoTime,
        }
        : {
            level: 'info' as const,
            formatters: {
                level: (label: string) => {
                    return { level: label.toUpperCase() };
                },
            },
            timestamp: pino.stdTimeFunctions.isoTime,
        };

export const logger = pino(pinoConfig);
