import * as React from 'react';
import StackItem from '../stack/stackItem';
import styles from './sheet.module.scss';

type Props = {
    children: React.ReactNode;
};

function SheetHeader({ children }: Props) {
    return <StackItem className={styles.sheet__header}>{children}</StackItem>;
}

export default SheetHeader;
