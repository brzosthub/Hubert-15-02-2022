import btcSnapshot from '../../../mocks/feed/book_ui_1/PI_XBTUSD_snapshot.json';
import btcUpdate from '../../../mocks/feed/book_ui_1/PI_XBTUSD_update.json';
import ethSnapshot from '../../../mocks/feed/book_ui_1/PI_ETHUSD_snapshot.json';
import ethUpdate from '../../../mocks/feed/book_ui_1/PI_ETHUSD_update.json';

//TODO: Feature - make checking sorting better, should.have.textArray
//TODO: Feature - enable screenshot comparing, move on lib level
//TODO: Feature - integration test should leave on their module level
describe('Order Book', () => {
    it('should show reconnect button when navigating away', () => {
        cy.clock();
        cy.visitIntegrationTests();
        cy.getByTestId('trading-app').should('be.visible');

        cy.waitForMessage({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD'],
        });

        cy.tick(2000);

        cy.getByTestId('error-notice').should('not.exist');

        cy.serverSend(btcSnapshot);

        cy.documentHidden(true);

        cy.waitForMessage({
            event: 'unsubscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD'],
        });

        cy.documentHidden(false);

        cy.getByTestId('reconnect-button').should('be.visible');

        cy.screenshot();

        cy.getByTestId('reconnect-button').click();

        cy.getByTestId('loading-overlay').should('be.visible');

        cy.waitForMessage({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD'],
        });

        cy.serverSend(btcSnapshot);

        cy.getByTestId('loading-overlay').should('not.exist');
        cy.getByTestId('error-notice').should('not.exist');

        cy.screenshot();
    });

    it('should show loading indicator', () => {
        cy.clock();
        cy.visitIntegrationTests();
        cy.getByTestId('trading-app').should('be.visible');

        cy.waitForMessage({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD'],
        });

        cy.getByTestId('loading-overlay').should('be.visible');
        cy.screenshot();
    });

    it('should handle alert message', () => {
        cy.clock();

        cy.visitIntegrationTests();

        cy.getByTestId('trading-app').should('be.visible');

        cy.waitForMessage({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD'],
        });

        cy.tick(20000);

        cy.getByTestId('error-notice')
            .should('be.visible')
            .contains('An error occurred: Bad request');

        cy.screenshot();
    });

    it('should show web socket support error', () => {
        cy.visitIntegrationTests('/', {
            isWebSocketDisabled: true,
        });

        cy.getByTestId('trading-app').should('be.visible');

        cy.getByTestId('error-notice')
            .should('be.visible')
            .contains('WebSocket not supported');
        cy.screenshot();
    });

    it('should show error boundary', () => {
        cy.disableErrorHandling();
        cy.visitIntegrationTests('/?throwError=true');

        cy.getByTestId('error-boundary-notice')
            .should('be.visible')
            .contains('Unexpected error occurred: error');

        cy.screenshot();
    });

    it('should show no data notice', () => {
        cy.clock();

        cy.visitIntegrationTests();

        cy.waitForMessage({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD'],
        });

        cy.serverSend([
            {
                event: 'subscribed',
                feed: 'book_ui_1',
                product_ids: ['PI_XBTUSD'],
            },
        ]);

        cy.serverSend([
            {
                feed: 'book_ui_1_snapshot',
                product_id: 'PI_XBTUSD',
                bids: [],
                asks: [],
            },
        ]);

        cy.getByTestId('data-notice').should('be.visible').contains('No data');

        cy.screenshot();
    });

    it('should show snapshot data', () => {
        cy.visitIntegrationTests();

        cy.waitForMessage({ event: 'subscribe' });

        cy.serverSend(btcSnapshot);

        cy.getByTestId('order-book-title')
            .should('be.visible')
            .should('have.text', 'Order Book');

        cy.getByTestId('bids-grid-header')
            .should('be.visible')
            .should('have.text', 'PriceSizeTotal');

        cy.getByTestId('asks-grid-header')
            .should('be.visible')
            .should('have.text', 'PriceSizeTotal');

        cy.getByTestId('spread-info')
            .should('be.visible')
            .should('have.text', 'Spread 16.00 (0.04%)');

        cy.getByTestId('bids-grid-price').should(
            'have.text',
            '42,829.0042,825.0042,823.0042,819.5042,819.0042,818.5042,816.0042,815.5042,815.0042,812.5042,811.5042,809.5042,808.0042,807.5042,805.0042,804.5042,801.5042,800.0042,799.00'
        );

        cy.getByTestId('bids-grid-size').should(
            'have.text',
            '5,9708,6054,86910,00050010,00018,44010,00012,5005,0174,4003,88438,89523,56130,20030,00014,2321,08555,000'
        );

        cy.getByTestId('bids-grid-total').should(
            'have.text',
            '5,97014,57519,44429,44429,94439,94458,38468,38480,88485,90190,30194,185133,080156,641186,841216,841231,073232,158287,158'
        );

        cy.getByTestId('asks-grid-price').should(
            'have.text',
            '42,845.0042,845.5042,846.0042,846.5042,847.0042,851.0042,853.0042,853.5042,856.0042,856.5042,857.5042,863.0042,865.0042,867.0042,867.5042,868.5042,869.0042,870.5042,871.50'
        );

        cy.getByTestId('asks-grid-size').should(
            'have.text',
            '1120,0006,4411,87732,32124,65455,00029,23022,5004,9243,12515,00015,00010,00023,99922,25213,8845,044'
        );

        cy.getByTestId('asks-grid-total').should(
            'have.text',
            '1220,00226,44328,32060,64185,295140,295169,525192,025196,949200,074215,074230,074240,074264,073286,325300,209305,253'
        );

        cy.getByTestId('toggle-feed').should('be.visible');

        cy.screenshot();
    });

    it('should show data after update', () => {
        cy.clock();

        cy.visitIntegrationTests();

        cy.waitForMessage({ event: 'subscribe' });

        cy.serverSend(btcSnapshot);
        cy.serverSend(ethUpdate);

        cy.tick(1000);

        cy.getByTestId('spread-info')
            .should('be.visible')
            .should('have.text', 'Spread 1,465.00 (3.42%)');

        cy.getByTestId('bids-grid-price').should(
            'have.text',
            '44,310.0044,309.0044,308.5044,307.0044,306.5044,305.0044,303.0044,300.0044,298.0044,295.5044,293.5044,285.0044,271.5044,271.0044,267.5044,267.0044,263.0044,257.0044,249.00'
        );

        cy.getByTestId('bids-grid-size').should(
            'have.text',
            '4,40032,16423,99941,0398,142155,0008,86015,0223,10010,00010,00010,00050,000402,89250,000160,00013,88150,000'
        );

        cy.getByTestId('bids-grid-total').should(
            'have.text',
            '4,40036,56460,563101,602109,744109,745164,745173,605188,627191,727201,727211,727221,727271,727674,619724,619884,619898,500948,500'
        );

        cy.getByTestId('asks-grid-price').should(
            'have.text',
            '42,845.0042,845.5042,846.0042,846.5042,847.0042,851.0042,853.0042,853.5042,856.0042,856.5042,857.5042,863.0042,865.0042,867.0042,867.5042,868.5042,869.0042,870.5042,871.50'
        );

        cy.getByTestId('asks-grid-size').should(
            'have.text',
            '1120,0006,4411,87732,32124,65455,00029,23022,5004,9243,12515,00015,00010,00023,99922,25213,8845,044'
        );

        cy.getByTestId('asks-grid-total').should(
            'have.text',
            '1220,00226,44328,32060,64185,295140,295169,525192,025196,949200,074215,074230,074240,074264,073286,325300,209305,253'
        );

        cy.getByTestId('toggle-feed').should('be.visible');

        cy.screenshot();
    });

    it('should change layout on vertical screen', () => {
        cy.visitIntegrationTests();

        cy.viewport('iphone-6');

        cy.waitForMessage({ event: 'subscribe' });

        cy.serverSend(btcSnapshot);

        cy.getByTestId('bids-grid-header').should('not.exist');

        cy.getByTestId('asks-grid-header')
            .should('be.visible')
            .should('have.text', 'PriceSizeTotal');

        cy.getByTestId('spread-info')
            .should('be.visible')
            .should('have.text', 'Spread 16.00 (0.04%)');

        cy.getByTestId('bids-grid-price').should(
            'have.text',
            '42,829.0042,825.0042,823.0042,819.5042,819.0042,818.5042,816.0042,815.5042,815.00'
        );

        cy.getByTestId('bids-grid-size').should(
            'have.text',
            '5,9708,6054,86910,00050010,00018,44010,00012,500'
        );

        cy.getByTestId('bids-grid-total').should(
            'have.text',
            '5,97014,57519,44429,44429,94439,94458,38468,38480,884'
        );

        cy.getByTestId('asks-grid-price').should(
            'have.text',
            '42,845.0042,845.5042,846.0042,846.5042,847.0042,851.0042,853.0042,853.5042,856.00'
        );

        cy.getByTestId('asks-grid-size').should(
            'have.text',
            '1120,0006,4411,87732,32124,65455,00029,230'
        );

        cy.getByTestId('asks-grid-total').should(
            'have.text',
            '1220,00226,44328,32060,64185,295140,295169,525'
        );

        cy.getByTestId('toggle-feed').should('be.visible');
    });

    it('it should render when invalid message is send in', () => {
        cy.visitIntegrationTests();

        cy.getByTestId('trading-app').should('be.visible');
        cy.waitForMessage({ event: 'subscribe' });

        cy.serverSend(btcSnapshot);
        cy.serverSend(btcUpdate);

        cy.serverSend(['dummy message']);

        cy.screenshot();
    });

    it('should allow product switch', () => {
        cy.visitIntegrationTests();
        cy.getByTestId('trading-app').should('be.visible');

        cy.waitForMessage({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD'],
        });

        cy.serverSend(btcSnapshot);

        cy.getByTestId('toggle-feed').should('be.visible').click();

        cy.getByTestId('loading-overlay').should('be.visible');

        cy.waitForMessage({
            feed: 'book_ui_1',
            product_ids: ['PI_ETHUSD'],
        });

        // leftover bitcoin messages
        cy.serverSend(btcUpdate);

        cy.serverSend(ethSnapshot);

        cy.getByTestId('loading-overlay').should('not.exist');

        cy.serverSend(ethUpdate);

        cy.getByTestId('spread-info')
            .should('be.visible')
            .should('have.text', 'Spread 5.60 (0.18%)');

        cy.screenshot();
    });

    it('should reconnect after server going down', () => {
        cy.clock();

        cy.visitIntegrationTests();
        cy.getByTestId('trading-app').should('be.visible');

        cy.waitForMessage({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD'],
        });

        cy.tick(2000);

        cy.serverSend(btcSnapshot);

        cy.tick(2000);

        cy.serverClose({ code: 1003 });

        cy.getByTestId('reconnect-notice').should('be.visible');

        cy.screenshot();

        // wait for reconnect timeout
        cy.tick(15000);

        cy.waitForMessage({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD'],
        });

        cy.serverSend(btcSnapshot);
        cy.serverSend(btcUpdate);

        // wait for flush
        cy.tick(1000);

        cy.getByTestId('reconnect-notice').should('not.exist');

        cy.getByTestId('spread-info')
            .should('be.visible')
            .should('have.text', 'Spread 579.50 (1.35%)');

        cy.screenshot();
    });

    it('should reconnect after no heartbeat', () => {
        cy.clock();

        cy.visitIntegrationTests();
        cy.getByTestId('trading-app').should('be.visible');

        cy.waitForMessage({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD'],
        });

        cy.tick(2000);

        cy.waitForMessage({
            event: 'subscribe',
            feed: 'heartbeat',
        });

        cy.serverSend(btcSnapshot);

        cy.serverSend([
            {
                feed: 'heartbeat',
                time: Date.now(),
            },
        ]);

        cy.getByTestId('reconnect-notice').should('not.exist');

        cy.tick(35000);

        cy.getByTestId('reconnect-notice').should('be.visible');

        cy.screenshot();
    });

    // TODO: Feature - we need to have more tests for two grids
    it('should render two grids', () => {
        cy.clock();

        cy.visitIntegrationTests('/?showDouble=true');

        cy.waitForMessage({ event: 'subscribe' });

        cy.serverSend(btcSnapshot);
        cy.serverSend(ethUpdate);

        cy.tick(1000);

        cy.getByTestId('order-book-title')
            .should('be.visible')
            .should('have.length', 2);

        cy.screenshot();
    });

    it('should show reconnect button when navigating away for both grids', () => {
        cy.clock();
        cy.visitIntegrationTests('/?showDouble=true&logLevel=debug');
        cy.getByTestId('trading-app').should('be.visible');

        cy.waitForMessage({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD'],
        });

        cy.tick(2000);

        cy.getByTestId('error-notice').should('not.exist');

        cy.serverSend(btcSnapshot);

        cy.documentHidden(true);

        cy.waitForMessage({
            event: 'unsubscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD'],
        });

        cy.documentHidden(false);

        cy.getByTestId('reconnect-button').its('length').should('eq', 2);

        cy.screenshot();

        cy.getByTestId('reconnect-button').eq(0).click();

        cy.waitForMessage({
            event: 'subscribe',
            feed: 'book_ui_1',
            product_ids: ['PI_XBTUSD'],
        });

        cy.serverSend([
            {
                event: 'subscribed',
                feed: 'book_ui_1',
                product_ids: ['PI_XBTUSD'],
            },
        ]);

        cy.serverSend(btcSnapshot);

        cy.tick(100);

        cy.getByTestId('loading-overlay').should('not.exist');
        cy.getByTestId('error-notice').should('not.exist');

        cy.screenshot();
    });
});
