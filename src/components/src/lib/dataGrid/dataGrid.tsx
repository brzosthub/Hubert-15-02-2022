import * as React from 'react';
import DataGridHeader from './dataGridHeader';
import styles from './dataGrid.module.scss';
import DataGridRow from './dataGridRow';
import classNames from 'classnames';
import { useMemo } from 'react';
import { Column, Styles } from './types';

type Props<T> = {
    dataTestId?: string;
    columns: ReadonlyArray<Column<T>>;
    rows: ReadonlyArray<T>;
    isHeaderDisabled?: boolean;
    isRightToLeft?: boolean;
    isInsetLeft?: boolean;
    isInsetRight?: boolean;
    isBottomUp?: boolean;
    isSnapToEnd?: boolean;
    rowStyleFunction?: (row: T) => Styles;
    rowContentFunction?: (row: T) => React.ReactNode;
    requestedRowCount?: number;
};

function DataGrid<T>({
    dataTestId,
    columns,
    rows,
    isHeaderDisabled,
    isRightToLeft,
    isInsetLeft,
    isInsetRight,
    isBottomUp,
    rowStyleFunction,
    rowContentFunction,
    isSnapToEnd,
    requestedRowCount = 0,
}: Props<T>) {
    const rowsToRender = useMemo(() => {
        if (requestedRowCount !== 0) {
            return rows?.slice(0, requestedRowCount);
        }
        return rows;
    }, [rows, requestedRowCount]);

    const bodyClasses = classNames(styles.dataGrid__body, {
        [styles.dataGrid__body_reverse]: isBottomUp,
        [styles.dataGrid__body_snapEnd]: isSnapToEnd,
    });

    return (
        <div className={styles.dataGrid} data-test-id={dataTestId}>
            {!isHeaderDisabled && (
                <DataGridHeader<T>
                    dataTestId={dataTestId}
                    columns={columns}
                    isInsetLeft={isInsetLeft}
                    isInsetRight={isInsetRight}
                    isRightToLeft={isRightToLeft}
                />
            )}
            <div className={bodyClasses}>
                {rowsToRender?.map((row: T, rowIndex: number) => (
                    <DataGridRow<T>
                        key={rowIndex}
                        columns={columns}
                        dataTestId={dataTestId}
                        row={row}
                        index={rowIndex}
                        isRightToLeft={isRightToLeft}
                        isInsetLeft={isInsetLeft}
                        isInsetRight={isInsetRight}
                        rowStyleFunction={rowStyleFunction}
                        rowContentFunction={rowContentFunction}
                    />
                ))}
            </div>
        </div>
    );
}

export default DataGrid;
