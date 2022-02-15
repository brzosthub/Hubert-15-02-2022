import * as React from 'react';
import StackItem from '../stack/stackItem';

type Props = {
    children: React.ReactNode;
    isFill?: boolean;
};

function SheetBody({ isFill, children }: Props) {
    return (
        <StackItem isGrow isFill={isFill}>
            {children}
        </StackItem>
    );
}

export default SheetBody;
