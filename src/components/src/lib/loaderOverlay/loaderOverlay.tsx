import * as React from 'react';
import Overlay from '../overlay/overlay';
import Loader from '../loader/loader';

type Props = {
    dataTestsId?: string;
    label?: string;
};

function LoaderOverlay({ dataTestsId, label = 'Loading data...' }: Props) {
    return (
        <Overlay dataTestId={dataTestsId}>
            <Loader />
            {label}
        </Overlay>
    );
}

export default LoaderOverlay;
