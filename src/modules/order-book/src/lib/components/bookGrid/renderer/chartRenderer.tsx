import * as React from 'react';
import styles from './chartRenderer.module.scss';
import classNames from 'classnames';

type Props = {
    className?: string;
    size: number;
    isRightToLeft?: boolean;
    isAsk?: boolean;
    isBid?: boolean;
};

function ChartRenderer({ size, isRightToLeft, isAsk, isBid }: Props) {
    const classes = classNames(styles.chartRenderer, {
        [styles.chartRenderer_reversed]: isRightToLeft,
        [styles.chartRenderer_ask]: isAsk,
        [styles.chartRenderer_bid]: isBid,
    });

    return (
        <div
            className={classes}
            style={{
                transform: `scaleX(${size})`,
            }}
        />
    );
}

export default React.memo(ChartRenderer);
