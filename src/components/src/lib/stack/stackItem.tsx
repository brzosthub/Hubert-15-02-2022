import * as React from 'react';
import classNames from 'classnames';
import styles from './stack.module.scss';

type Props = {
    dataTestId?: string;
    className?: string;
    isCenter?: boolean;
    isGrow?: boolean;
    isFill?: boolean;
    growFactor?: number;
    children?: React.ReactNode;
};

function StackItem({
    className,
    dataTestId,
    isCenter,
    isGrow,
    isFill,
    children,
    growFactor,
}: Props) {
    const classes = classNames(className, styles.stack__item, {
        [styles.stack__item_center]: isCenter,
        [styles.stack__item_fill]: isFill,
        [styles.stack__item_grow]: isGrow,
    });

    let inlineStyles = undefined;
    if (growFactor) {
        inlineStyles = { flexGrow: growFactor };
    }

    return (
        <div className={classes} data-test-id={dataTestId} style={inlineStyles}>
            {children}
        </div>
    );
}

export default StackItem;
