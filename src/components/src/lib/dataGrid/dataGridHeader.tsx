import * as React from 'react';
import DataGridHeaderCell from './dataGridHederCell';
import styles from './dataGrid.module.scss';
import classNames from 'classnames';
import { Column } from './types';

type Props<T> = {
    dataTestId?: string;
    columns: ReadonlyArray<Column<T>>;
    isRightToLeft?: boolean;
    isInsetLeft?: boolean;
    isInsetRight?: boolean;
};

function DataGridHeader<T>({
    dataTestId,
    columns,
    isRightToLeft,
    isInsetLeft,
    isInsetRight,
}: Props<T>) {
    const classes = classNames(styles.dataGrid__header, {
        [styles.dataGrid__header_reverse]: isRightToLeft,
        [styles.dataGrid__header_insetLeft]: isInsetLeft,
        [styles.dataGrid__header_insetRight]: isInsetRight,
    });

    return (
        <div className={classes} data-test-id={`${dataTestId}-header`}>
            {columns.map((column, columnIndex) => {
                return <DataGridHeaderCell key={columnIndex} column={column} />;
            })}
        </div>
    );
}

export default React.memo(DataGridHeader) as typeof DataGridHeader;
