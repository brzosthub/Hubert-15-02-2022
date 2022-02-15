import { Config } from './types';

const urlSearchParams = new URLSearchParams(window.location.search);
const params: Record<string, string> = {};

urlSearchParams.forEach((value, key) => {
    params[key] = value;
});

export default params as Config;
