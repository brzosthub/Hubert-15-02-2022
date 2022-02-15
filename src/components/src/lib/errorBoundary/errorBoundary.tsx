import React, { ErrorInfo } from 'react';
import { getLogger } from '@trading/utils';
import NoticeOverlay from '../noticeOverlay/noticeOverlay';

type Props = {
    children: React.ReactNode;
};

type State = {
    error?: Error;
    errorInfo?: ErrorInfo;
};

const log = getLogger('ErrorBoundary');

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromError = (error: Error) => {
        return { error };
    };

    override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
        log.error(
            'received unmatched error',
            error.message,
            errorInfo.componentStack
        );
    }

    override render() {
        const { error } = this.state;
        if (error) {
            return (
                <NoticeOverlay
                    dataTestId="error-boundary-notice"
                    message={error?.message}
                    icon="error"
                    title="Unexpected error occurred:"
                />
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
