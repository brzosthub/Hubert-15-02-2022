import { LogLevelDesc } from './logger';

export type Config = {
    logLevel?: LogLevelDesc;
    showStats?: boolean;
    showDouble?: boolean;
    showAll?: boolean;
    throwError?: boolean;
    stressIt?: string;
};
