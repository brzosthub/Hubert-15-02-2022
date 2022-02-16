import { LogLevelDesc } from './logger';

export type Config = {
    logLevel?: LogLevelDesc;
    showDouble?: boolean;
    showAll?: boolean;
    throwError?: boolean;
    stressIt?: string;
};
