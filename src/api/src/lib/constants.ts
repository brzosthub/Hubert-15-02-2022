export const API_WEBSOCKET_URL = 'wss://www.cryptofacilities.com/ws/v1';

// Reconnect after 10s
export const RECONNECT_TIMEOUT = 10000;

// Require heartbeat each 15s
export const HEARTBEAT_TIMEOUT = 15000;

// TODO: Feature - we could measure that
export const FRAME_TIME = 1000 / 60;

export const MIN_THROTTLE_TIME = FRAME_TIME;

// You can notice only 250 on screen, double that
export const MAX_THROTTLE_TIME = 500;

export const FEED_CHANNEL_SUBSCRIBE_TIMEOUT = 10000;
