import * as React from 'react';
import styles from './overlay.module.scss';
import Stack from '../stack/stack';
import StackItem from '../stack/stackItem';

type Props = {
    dataTestId?: string;
    children?: React.ReactNode;
};

function Overlay({ dataTestId, children }: Props) {
    const childrenList = React.Children.toArray(children);

    return (
        <div className={styles.overlay} data-test-id={dataTestId}>
            <Stack isVertical isCrossCenter isCenter>
                {childrenList?.map((item, index) => {
                    return <StackItem key={index}>{item}</StackItem>;
                })}
            </Stack>
        </div>
    );
}

export default Overlay;
