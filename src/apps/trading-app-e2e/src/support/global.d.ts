declare namespace Cypress {
    interface VisitIntegrationTestsOptions {
        isServerDisabled?: boolean;
        isWebSocketDisabled?: boolean;
    }

    declare type ServerMessage = Record<string, any>;

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

        serverSend(data: Array<ServerMessage | string>): Chainable<null>;

        waitForMessage(
            data: Array<ServerMessage> | ServerMessage,
            contains?: boolean
        ): Chainable<null>;

        documentHidden(isHidden?: boolean): Chainable<null>;
    }
}

interface Window {
    createMockWebSocket: (url: string) => WebSocket;
}
