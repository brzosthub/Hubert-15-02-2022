import * as React from 'react';

import {
    DataGrid,
    useVisibleRowsCount,
    NoticeOverlay,
    Stack,
    StackItem,
} from '@trading/components';

import ChartRenderer from './renderer/chartRenderer';
import { useSelector } from 'react-redux';
import * as constants from './constants';
import { useCallback, useMemo } from 'react';
import { createGetBids, createGetAsks } from '../../selectors';
import { getTotalOfTotals } from '../../queries';
import SpreadInfo from '../spreadInfo/spreadInfo';
import { Level, OrderBookState } from '@trading/models/order-book';
import { config } from '@trading/utils';
import { getNumLevels } from '@trading/models/order-book';

type Props = {
    selectedProductId: string;
    isVertical?: boolean;
    isLoading?: boolean;
    isSnapshotLoaded?: boolean;
    showNoData?: boolean;
};

function BookGrid({
    selectedProductId,
    isVertical,
    isLoading,
    isSnapshotLoaded,
}: Props) {
    const { ref, visibleRowCount = 0 } = useVisibleRowsCount(
        isVertical ? 2 : 1
    );

    const numLevels = useSelector((state: OrderBookState) =>
        getNumLevels(state, selectedProductId)
    );

    const displayRowCount = useMemo(
        () =>
            config.showAll
                ? visibleRowCount
                : Math.min(visibleRowCount, numLevels),
        [numLevels, visibleRowCount]
    );

    const getBids = useMemo(
        () => createGetBids(selectedProductId, displayRowCount),
        [selectedProductId, displayRowCount]
    );

    const getAsks = useMemo(
        () => createGetAsks(selectedProductId, displayRowCount),
        [selectedProductId, displayRowCount]
    );

    const bids = useSelector((state: OrderBookState) => getBids(state));
    const asks = useSelector((state: OrderBookState) => getAsks(state));

    const total = useMemo(() => getTotalOfTotals(bids, asks), [bids, asks]);

    const bidContentFunction = useCallback(
        (data: Level) => {
            const percents = data[2] / total;
            return (
                <ChartRenderer
                    size={percents}
                    isBid
                    isRightToLeft={!isVertical}
                />
            );
        },
        [total, isVertical]
    );

    const askContentFunction = useCallback(
        (data: Level) => {
            const percents = data[2] / total;
            return <ChartRenderer size={percents} isAsk />;
        },
        [total]
    );

    const isNoData =
        !isLoading && isSnapshotLoaded && !bids?.length && !asks.length;

    return (
        <Stack
            refCallback={ref}
            isVertical={isVertical}
            isReversed={isVertical}
        >
            {isNoData && (
                <NoticeOverlay
                    dataTestId="data-notice"
                    message="No data"
                    icon="info"
                />
            )}
            <StackItem isFill isGrow={!isVertical}>
                <DataGrid<Level>
                    dataTestId="bids-grid"
                    rows={bids}
                    isInsetRight
                    isInsetLeft={isVertical}
                    columns={constants.BID_COLUMNS}
                    isRightToLeft={!isVertical}
                    isHeaderDisabled={isVertical}
                    rowContentFunction={bidContentFunction}
                />
            </StackItem>
            <StackItem isFill isCenter>
                {isVertical && (
                    <SpreadInfo
                        selectedProductId={selectedProductId}
                        isVertical
                    />
                )}
            </StackItem>
            <StackItem isFill isGrow={!isVertical}>
                <DataGrid<Level>
                    dataTestId="asks-grid"
                    rows={asks}
                    isInsetRight
                    isInsetLeft={isVertical}
                    isBottomUp={isVertical}
                    columns={constants.ASK_COLUMNS}
                    rowContentFunction={askContentFunction}
                />
            </StackItem>
        </Stack>
    );
}

export default React.memo(BookGrid);
