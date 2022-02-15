import * as React from 'react';
import type * as types from './types';
import DataGridRowCell from './dataGridRowCell';
import styles from './dataGrid.module.scss';
import classNames from 'classnames';
import { itemToLabel } from './utils';
import { Column } from './types';

type Props<T> = {
    dataTestId?: string;
    columns: ReadonlyArray<Column<T>>;
    index?: number;
    row: T;
    isRightToLeft?: boolean;
    isInsetLeft?: boolean;
    isInsetRight?: boolean;
    rowStyleFunction?: (row: T) => types.Styles;
    rowContentFunction?: (row: T) => React.ReactNode;
};

function DataGridRow<T>({
    index,
    dataTestId,
    columns,
    row,
    isRightToLeft,
    isInsetLeft,
    isInsetRight,
    rowStyleFunction,
    rowContentFunction,
}: Props<T>) {
    const classes = classNames(styles.dataGrid__row, {
        [styles.dataGrid__row_reverse]: isRightToLeft,
        [styles.dataGrid__row_insetLeft]: isInsetLeft,
        [styles.dataGrid__row_insetRight]: isInsetRight,
    });

    const rowStyles = rowStyleFunction ? rowStyleFunction(row) : undefined;
    const rowContent = rowContentFunction ? rowContentFunction(row) : false;

    return (
        <div
            className={classes}
            style={rowStyles}
            data-test-id={`${dataTestId}-row-${index}`}
        >
            {rowContent}
            {columns.map((column, columnIndex) => {
                const renderedValue = itemToLabel(column, row);

                return (
                    <DataGridRowCell
                        dataTestId={`${dataTestId}-${column.id}`}
                        key={columnIndex}
                        className={column.className}
                        value={renderedValue}
                    />
                );
            })}
        </div>
    );
}

export default React.memo(DataGridRow) as typeof DataGridRow;
