import * as React from 'react';
import Stack from '../stack/stack';

type Props = {
    children: React.ReactNode;
};

function Sheet({ children }: Props) {
    return <Stack isVertical>{children}</Stack>;
}

export default Sheet;
