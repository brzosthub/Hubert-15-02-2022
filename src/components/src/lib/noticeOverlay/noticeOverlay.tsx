import * as React from 'react';
import Overlay from '../overlay/overlay';
import Icon, { IconType } from '../icon/icon';

type Props = {
    dataTestId?: string;
    title?: string;
    message?: string;
    icon?: IconType;
};

function NoticeOverlay({ dataTestId, message, icon, title }: Props) {
    return (
        <Overlay dataTestId={dataTestId}>
            {icon && <Icon type={icon} />}
            <span>
                {title && <span>{title}</span>} {message}
            </span>
        </Overlay>
    );
}

export default NoticeOverlay;
