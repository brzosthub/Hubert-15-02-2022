// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { WebSocket as MockWebSocket, Server } from 'mock-websocket';
import chaiSubset from 'chai-subset';
import ServerMessage = Cypress.ServerMessage;

chai.use(chaiSubset);

let server: Server;
let apiUrl: string;
let connectResolve: (client: MockWebSocket) => void;
let connectPromise: Promise<MockWebSocket>;
let messages: Array<ServerMessage> = [];

function setupServer() {
    server = new Server(apiUrl, { mockGlobal: false });
    connectPromise = new Promise<MockWebSocket>((resolve) => {
        connectResolve = resolve;
    });

    server.on('connection', (socket) => {
        connectResolve(socket);
    });

    server.on('message', (socket: MockWebSocket, message: string) => {
        const parsed = JSON.parse(message);
        messages.push(parsed);
        Cypress.log({
            message: 'server got message:' + message,
            name: 'server',
        });
    });
}

// TODO: Feature - implement findByTestId
Cypress.Commands.add('getByTestId', (dataTestId) => {
    cy.get(`[data-test-id="${dataTestId}"]`);
});

Cypress.Commands.add('visitIntegrationTests', (url = '/', options) => {
    cy.on('window:before:load', (win: Window) => {
        win.createMockWebSocket = (url) => {
            apiUrl = url;

            if (options?.isWebSocketDisabled) {
                return undefined;
            }

            if (!options?.isServerDisabled) {
                setupServer();
            }
            return new MockWebSocket(apiUrl) as unknown as WebSocket;
        };
    });

    cy.on('test:after:run', () => {
        messages = [];
        server?.stop();
    });

    cy.visit(url);
});

Cypress.Commands.add('serverStart', () => {
    setupServer();
});

Cypress.Commands.add('documentHidden', (isHidden = false) => {
    cy.document().then((doc) => {
        cy.stub(doc, 'hidden').value(isHidden);
        cy.stub(doc, 'visibilityState').value(isHidden ? 'hidden' : 'visible');
    });
    cy.document().trigger('visibilitychange');
});

Cypress.Commands.add('serverSend', (data: Array<ServerMessage | string>) => {
    cy.wrap<Promise<MockWebSocket>, MockWebSocket>(connectPromise, {
        log: false,
    }).then(() => {
        data.forEach((item) => {
            const message =
                typeof item === 'string' ? item : JSON.stringify(item);
            server.send(message);
        });
    });
});

Cypress.Commands.add('serverStop', () => {
    messages = [];
    server.stop();
});

Cypress.Commands.add('serverClose', (options?: CloseEventInit) => {
    messages = [];
    server.close(options);
    server.stop();
});

Cypress.Commands.add(
    'waitForMessage',
    (message: ServerMessage, shouldExist = true) => {
        if (shouldExist) {
            cy.wrap(connectPromise, { log: false })
                .wrap(messages, { log: false })
                .should('containSubset', [message]);
        } else {
            cy.wrap(connectPromise, { log: false })
                .wrap(messages, { log: false })
                .should('not.containSubset', [message]);
        }
    }
);

Cypress.Commands.add('disableErrorHandling', () => {
    cy.on('uncaught:exception', () => {
        return false;
    });
});
