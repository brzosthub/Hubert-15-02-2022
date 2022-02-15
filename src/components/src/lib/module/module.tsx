import * as React from 'react';
import styles from './module.module.scss';
import OrientationProvider from '../orientationProvider/orientationProvider';
import ErrorBoundary from '../errorBoundary/errorBoundary';
type Props = {
    children: React.ReactNode;
};

function Module({ children }: Props) {
    return (
        <ErrorBoundary>
            <OrientationProvider>
                {(ref) => (
                    <div className={styles.module} ref={ref}>
                        {children}
                    </div>
                )}
            </OrientationProvider>
        </ErrorBoundary>
    );
}

export default Module;
