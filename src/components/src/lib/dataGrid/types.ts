export type Column<T> = {
    id: string;
    label: string;
    className?: string;
    dataField?: string;
    formatter?: (value: number) => string;
    dataFunction?: (row: T) => number;
};

export type Row = Array<number> | Record<string, number>;

export type Styles = Record<string, string | number>;
