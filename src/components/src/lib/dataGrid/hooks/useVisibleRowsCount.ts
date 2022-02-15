import useResizeObserver from '../../useResizeObserver/useResizeObserver';
import { useMemo } from 'react';
import variables from '../dataGridExport.module.scss';

function useVisibleRowsCount(amountOfGrids = 1) {
    const { ref, height = 0 } = useResizeObserver<HTMLDivElement>();

    const rowHeight = useMemo(() => parseInt(variables.rowHeight, 10), []);
    const headerHeight = useMemo(
        () => parseInt(variables.headerHeight, 10),
        []
    );

    const visibleRowCount = useMemo(
        () =>
            Math.floor(
                (height - amountOfGrids * headerHeight) /
                    amountOfGrids /
                    rowHeight
            ),
        [rowHeight, headerHeight, height, amountOfGrids]
    );

    return { ref, visibleRowCount };
}

export default useVisibleRowsCount;
