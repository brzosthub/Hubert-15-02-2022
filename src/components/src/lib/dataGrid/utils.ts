import { Column } from './types';

function itemToLabel<T>(column: Column<T>, row: T) {
    let value: number;

    if (column.dataFunction) {
        value = column.dataFunction(row);

        if (column.formatter && value !== undefined) {
            return column.formatter(value);
        }

        return value?.toString();
    }

    return '';
}

export { itemToLabel };
