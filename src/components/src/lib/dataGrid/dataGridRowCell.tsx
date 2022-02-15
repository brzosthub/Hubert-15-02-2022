import * as React from 'react';
import styles from './dataGrid.module.scss';
import classNames from 'classnames';

type Props = {
    dataTestId?: string;
    value: string;
    className?: string;
};

function DataGridRowCell({ dataTestId, value, className }: Props) {
    const classes = classNames(styles.dataGrid__rowCell, className);
    return (
        <div className={classes} data-test-id={dataTestId}>
            {value}
        </div>
    );
}

export default React.memo(DataGridRowCell);
