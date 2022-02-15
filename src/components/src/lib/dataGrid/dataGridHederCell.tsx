import * as React from 'react';
import styles from './dataGrid.module.scss';
import { Column } from './types';

type Props<T> = {
    column: Column<T>;
};

function DataGridHeaderCell<T>({ column }: Props<T>) {
    return <div className={styles.dataGrid__headerCell}>{column.label}</div>;
}

export default DataGridHeaderCell;
