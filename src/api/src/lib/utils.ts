import { FeedArgs } from './types';

export const getEndpointHash = (endpoint: string, args: FeedArgs) => {
    const paramsHash = JSON.stringify(args);
    return `$${endpoint}-${paramsHash}`;
};
