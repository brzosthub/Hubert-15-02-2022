import log, { getLogger, LogLevelDesc } from 'loglevel';
import config from '../lib/config';

// TODO: Feature - switch to sth more sophisticated, add server side logs
const originalFactory = log.methodFactory;

log.methodFactory = function (methodName, logLevel, loggerName) {
    const rawMethod = originalFactory(methodName, logLevel, loggerName);

    return function (...rest) {
        const args = [`[${methodName}] [${loggerName as string}]`].concat(rest);
        rawMethod(...args);
    };
};

log.setLevel(config.logLevel || 'info');

export { getLogger };
export type { LogLevelDesc };
