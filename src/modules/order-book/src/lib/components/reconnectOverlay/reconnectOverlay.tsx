import * as React from 'react';
import { SyntheticEvent } from 'react';
import { Overlay, Button } from '@trading/components';

type Props = {
    dataTestId?: string;
    onReconnect: (evt?: SyntheticEvent) => void;
};

function ReconnectOverlay({ dataTestId, onReconnect }: Props) {
    return (
        <Overlay dataTestId={dataTestId}>
            <Button
                dataTestId="reconnect-button"
                label="Reconnect"
                onClick={onReconnect}
            />
        </Overlay>
    );
}

export default ReconnectOverlay;
