import { useContext } from 'react';
import OrientationContext from './orientationContext';

function useOrientation() {
    return useContext(OrientationContext);
}

export default useOrientation;
