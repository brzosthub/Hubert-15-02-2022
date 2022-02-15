import * as React from 'react';
import { SyntheticEvent } from 'react';
import styles from './button.module.scss';

type Props = {
    dataTestId?: string;
    label: string;
    isDisabled?: boolean;
    onClick?: (evt: SyntheticEvent) => void;
};

function Button({ dataTestId, label, isDisabled, onClick }: Props) {
    return (
        <input
            data-test-id={dataTestId}
            className={styles.button}
            type="button"
            onClick={onClick}
            value={label}
            disabled={isDisabled}
        />
    );
}

export default Button;
