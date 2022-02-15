import styles from './bookGrid.module.scss';
import { priceFormatter, sizeFormatter } from '../formatters';
import { Column } from '@trading/components';
import { Level } from '@trading/models/order-book';

const SIZE_COLUMN: Column<Level> = {
    id: 'size',
    label: 'Size',
    dataFunction: (row: Level) => row[1],
    formatter: sizeFormatter.format,
    className: styles.bookGrid__column_primary,
};

const TOTAL_COLUMN: Column<Level> = {
    id: 'total',
    label: 'Total',
    dataFunction: (row: Level) => row[2],
    formatter: sizeFormatter.format,
    className: styles.bookGrid__column_primary,
};

const BID_PRICE_COLUMN: Column<Level> = {
    id: 'price',
    label: 'Price',
    dataFunction: (row: Level) => row[0],
    formatter: priceFormatter.format,
    className: styles.bookGrid__column_bid,
};

const ASK_PRICE_COLUMN: Column<Level> = {
    id: 'price',
    label: 'Price',
    dataFunction: (row: Level) => row[0],
    formatter: priceFormatter.format,
    className: styles.bookGrid__column_ask,
};

export const BID_COLUMNS: ReadonlyArray<Column<Level>> = [
    BID_PRICE_COLUMN,
    SIZE_COLUMN,
    TOTAL_COLUMN,
];

export const ASK_COLUMNS: ReadonlyArray<Column<Level>> = [
    ASK_PRICE_COLUMN,
    SIZE_COLUMN,
    TOTAL_COLUMN,
];
