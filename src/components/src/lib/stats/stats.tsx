import * as React from 'react';
import StatsPanel from 'stats.js';
import { useEffect, useRef } from 'react';

function Stats() {
    const ref = useRef<StatsPanel>(new StatsPanel());

    useEffect(() => {
        const stats = ref.current;
        stats.showPanel(0);
        document.body.appendChild(stats.dom);

        // This is not perfect
        const measure = () => {
            stats.begin();

            requestAnimationFrame(() => {
                stats.end();
                measure();
            });
        };

        measure();
    }, []);

    return <></>;
}

export default Stats;
