import * as React from 'react';
import {
    Button,
    Stack,
    StackItem,
    Header,
    useOrientation,
    usePageVisibility,
    LoaderOverlay,
    Sheet,
    SheetHeader,
    SheetFooter,
    SheetBody,
    NoticeOverlay,
} from '@trading/components';

import { SpreadInfo, BookGrid, ReconnectOverlay } from './components';

import { useCallback, useEffect, useMemo, useState } from 'react';
import * as constants from './constants';
import { useDispatch, useSelector } from 'react-redux';
import {
    subscribe,
    unsubscribe,
    createGetOrderBookFeed,
    getProduct,
} from '@trading/models/order-book';
import type { OrderBookState } from '@trading/models/order-book';
import type { FeedState } from '@trading/models/feed';
import { getInfo } from '@trading/models/feed';
import { getSelectedProduct } from './selectors';
import { OrderBookModuleState } from './types';
import { setSelectedProduct } from './actions';
import { BITCOIN_PRODUCT } from './constants';

type Props = {
    componentId: string;
};

function OrderBook({ componentId }: Props) {
    const dispatch = useDispatch();
    const isVertical = useOrientation();
    const isActive = usePageVisibility();
    const [showReconnect, setShowReconnect] = useState(false);

    const selectedProduct = useSelector((state: OrderBookModuleState) =>
        getSelectedProduct(state, componentId)
    );

    /**
     * TODO - Feature - Wrap in hook
     */
    const getFeed = useMemo(
        () => createGetOrderBookFeed(selectedProduct),
        [selectedProduct]
    );

    /**
     * TODO - Feature - move isSnapshotLoaded to feed entity
     */
    const isSnapshotLoaded = useSelector((state: OrderBookState) => {
        return getProduct(state, selectedProduct)?.isSnapshotLoaded;
    });

    const subscription = useSelector((state: FeedState) => getFeed(state));

    const { isLoading, isReconnecting, isSubscribed, isError, error } = useMemo(
        () => getInfo(subscription),
        [subscription]
    );

    /**
     * Handle toggle feed
     */
    const handleToggleFeed = useCallback(() => {
        const nextProductId =
            selectedProduct === constants.BITCOIN_PRODUCT
                ? constants.ETH_PRODUCT
                : constants.BITCOIN_PRODUCT;

        dispatch(
            setSelectedProduct({
                selectedProduct: nextProductId,
                componentId,
            })
        );

        dispatch(unsubscribe(selectedProduct, componentId, true, false));
    }, [selectedProduct, componentId, dispatch]);

    /**
     * Handle reconnect
     */
    const handleReconnect = useCallback(() => {
        setShowReconnect(false);
        dispatch(subscribe(selectedProduct, componentId));
    }, [selectedProduct, componentId, dispatch]);

    /**
     * Handle loosing visibility
     */
    useEffect(() => {
        if (!isActive && !isReconnecting && !isError) {
            setShowReconnect(true);
            dispatch(unsubscribe(selectedProduct, componentId));
        }
    }, [
        isActive,
        isReconnecting,
        isError,
        dispatch,
        selectedProduct,
        componentId,
    ]);

    /**
     * Subscribe on product change
     */
    useEffect(() => {
        if (selectedProduct) {
            dispatch(subscribe(selectedProduct, componentId));
        }
    }, [dispatch, selectedProduct, componentId]);

    /**
     * Initial mount
     */
    useEffect(() => {
        dispatch(
            setSelectedProduct({
                selectedProduct: BITCOIN_PRODUCT,
                componentId,
            })
        );
    }, [dispatch, componentId]);

    /**
     * Hide reconnect on subscribe
     */
    useEffect(() => {
        if (isSubscribed) {
            setShowReconnect(false);
        }
    }, [isSubscribed]);

    const showLoader = isLoading && !isSnapshotLoaded;

    return (
        <Sheet>
            {showReconnect && (
                <ReconnectOverlay
                    dataTestId="reconnect-overlay"
                    onReconnect={handleReconnect}
                />
            )}
            <SheetHeader>
                <Stack isCrossCenter>
                    <StackItem isGrow>
                        <Header isPrimary dataTestId="order-book-title">
                            Order Book
                        </Header>
                    </StackItem>
                    {!isVertical && (
                        <>
                            <StackItem isGrow isCenter growFactor={2}>
                                <SpreadInfo
                                    selectedProductId={selectedProduct}
                                />
                            </StackItem>
                            <StackItem isGrow />
                        </>
                    )}
                </Stack>
            </SheetHeader>
            <SheetBody isFill>
                {isError && (
                    <NoticeOverlay
                        dataTestId="error-notice"
                        title="An error occurred:"
                        message={error}
                        icon="error"
                    />
                )}
                {showLoader && <LoaderOverlay dataTestsId="loading-overlay" />}
                {isReconnecting && (
                    <NoticeOverlay
                        dataTestId="reconnect-notice"
                        title="Connection lost:"
                        message="Reconnecting..."
                        icon="warning"
                    />
                )}
                <BookGrid
                    selectedProductId={selectedProduct}
                    isVertical={isVertical}
                    isLoading={isLoading}
                    isSnapshotLoaded={isSnapshotLoaded}
                />
            </SheetBody>
            <SheetFooter isCenter>
                <Button
                    dataTestId="toggle-feed"
                    label="Toggle Feed"
                    isDisabled={isError || isReconnecting}
                    onClick={handleToggleFeed}
                />
            </SheetFooter>
        </Sheet>
    );
}

export default React.memo(OrderBook);
