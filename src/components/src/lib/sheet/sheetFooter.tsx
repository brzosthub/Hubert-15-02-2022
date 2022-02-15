import * as React from 'react';
import StackItem from '../stack/stackItem';
import styles from './sheet.module.scss';

type Props = {
    children: React.ReactNode;
    isCenter?: boolean;
};

function SheetFooter({ isCenter, children }: Props) {
    return (
        <StackItem className={styles.sheet__footer} isCenter={isCenter}>
            {children}
        </StackItem>
    );
}

export default SheetFooter;
