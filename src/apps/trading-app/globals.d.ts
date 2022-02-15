declare global {
    interface Window {
        createMockWebSocket: (url: string) => WebSocket;
        Cypress: unknown;
        getStore: () => unknown;
    }
}

export {};
