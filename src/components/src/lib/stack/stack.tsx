import * as React from 'react';
import classNames from 'classnames';
import styles from './stack.module.scss';
import { RefCallback } from 'react';

type Props = {
    refCallback?: RefCallback<HTMLDivElement>;
    dataTestId?: string;
    isVertical?: boolean;
    isReversed?: boolean;
    isCenter?: boolean;
    isCrossCenter?: boolean;
    children: React.ReactNode;
};
function Stack({
    refCallback,
    dataTestId,
    isVertical,
    isReversed,
    isCenter,
    isCrossCenter,
    children,
}: Props) {
    const classes = classNames(styles.stack, {
        [styles.stack_vertical]: isVertical && !isReversed,
        [styles.stack_verticalReversed]: isVertical && isReversed,
        [styles.stack_reversed]: !isVertical && isReversed,
        [styles.stack_center]: isCenter,
        [styles.stack_crossCenter]: isCrossCenter,
    });

    return (
        <div ref={refCallback} className={classes} data-test-id={dataTestId}>
            {children}
        </div>
    );
}

export default Stack;
