import * as React from 'react';
import { Header } from '@trading/components';
import * as selectors from '../../selectors';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { percentageFormatter, priceFormatter } from '../formatters';
import styles from './spreadInfo.module.scss';
import classNames from 'classnames';
import { config } from '@trading/utils/config';
import { OrderBookState } from '@trading/models/order-book';

type Props = {
    selectedProductId: string;
    isVertical?: boolean;
};

function SpreadInfo({ selectedProductId, isVertical }: Props) {
    const getSpread = useMemo(
        () => selectors.createGetSpread(selectedProductId),
        [selectedProductId]
    );
    const getSpreadPercentage = useMemo(
        () => selectors.createGetSpreadPercentage(selectedProductId),
        [selectedProductId]
    );

    const spread = useSelector<OrderBookState, number>((state) =>
        getSpread(state)
    );
    const spreadPercentage = useSelector<OrderBookState, number>((state) =>
        getSpreadPercentage(state, spread)
    );

    const classes = classNames({
        [styles.spreadInfo_isVertical]: isVertical,
    });

    // TODO: Feature - Move to better place, wrap in env
    if (window.Cypress && config.throwError) {
        throw new Error('error');
    }

    return (
        <Header className={classes} dataTestId="spread-info">
            Spread {priceFormatter.format(spread)} (
            {percentageFormatter.format(spreadPercentage)})
        </Header>
    );
}

export default React.memo(SpreadInfo);
