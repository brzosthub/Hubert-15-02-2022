import * as React from 'react';
import { RefCallback } from 'react';
import useResizeObserver from '../useResizeObserver/useResizeObserver';
import OrientationContext from './orientationContext';

type Props = {
    children: (ref: RefCallback<HTMLDivElement>) => React.ReactNode;
};

function OrientationProvider({ children }: Props) {
    const { ref, width = 2, height = 1 } = useResizeObserver<HTMLDivElement>();

    const isVertical = width <= height;

    return (
        <OrientationContext.Provider value={isVertical}>
            {children(ref)}
        </OrientationContext.Provider>
    );
}

export default OrientationProvider;
