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

chai.use(chaiSubset);

let server: Server;
let apiUrl: string;
let client: MockWebSocket;
let connectResolve: (client: MockWebSocket) => void;
let connectReject: () => void;
let connectPromise: Promise<MockWebSocket>;
let messages: Array<Record<string, any>> = [];

function setupServer() {
    server = new Server(apiUrl, { mockGlobal: false });
    connectPromise = new Promise<MockWebSocket>((resolve, reject) => {
        connectResolve = resolve;
        connectReject = reject;
    });

    server.on('connection', (socket) => {
        client = socket;
        connectResolve(socket);
    });

    server.on('message', (socket: MockWebSocket, data: any) => {
        const message = data.toString();
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

Cypress.Commands.add(
    'serverSend',
    (data: Array<Record<string, any> | string>) => {
        cy.wrap<Promise<MockWebSocket>, MockWebSocket>(connectPromise, {
            log: false,
        }).then(() => {
            data.forEach((item) => {
                const message =
                    typeof item === 'string' ? item : JSON.stringify(item);
                server.send(message);
            });
        });
    }
);

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
    (message: Record<string, any>, shouldExist = true) => {
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
