declare namespace Cypress {
    interface VisitIntegrationTestsOptions {
        isServerDisabled?: boolean;
        isWebSocketDisabled?: boolean;
    }

    interface Chainable<Subject> {
        getByTestId(value: string): Chainable<Element>;

        visitIntegrationTests(
            url?: string,
            options?: VisitIntegrationTestsOptions
        ): Chainable<null>;

        disableWebSocket(): Chainable<null>;

        disableErrorHandling(): Chainable<null>;

        serverStart(): Chainable<null>;

        serverClose(options?: CloseEventInit): Chainable<null>;

        serverStop(): Chainable<null>;

        serverSend(data: Array<Record<string, any> | string>): Chainable<null>;

        waitForMessage(
            data: Array<Record<string, any>> | Record<string, any>,
            contains?: boolean
        ): Chainable<null>;

        documentHidden(isHidden?: boolean): Chainable<null>;
    }
}

interface Window {
    createMockWebSocket: (url: string) => WebSocket;
}
