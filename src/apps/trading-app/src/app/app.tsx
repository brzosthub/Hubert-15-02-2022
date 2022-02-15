import * as React from 'react';
import { OrderBook } from '@trading/modules/order-book';
import { Provider } from 'react-redux';
import getStore from './store';
import styles from './app.module.scss';
import { Module, ErrorBoundary, Stats } from '@trading/components';
import { config } from '@trading/utils';

type Props = {
    dataTestId?: string;
};

function App({ dataTestId }: Props) {
    return (
        <React.StrictMode>
            <ErrorBoundary>
                <Provider store={getStore()}>
                    <div data-test-id={dataTestId} className={styles.app}>
                        {config.showStats && <Stats />}
                        <Module>
                            <OrderBook componentId="depthOfMarket1" />
                        </Module>
                        {config.showDouble && (
                            <Module>
                                <OrderBook componentId="depthOfMarket2" />
                            </Module>
                        )}
                    </div>
                </Provider>
            </ErrorBoundary>
        </React.StrictMode>
    );
}

export default App;
