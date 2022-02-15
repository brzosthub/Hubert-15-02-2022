import * as React from 'react';
import styles from './icon.module.scss';
import classNames from 'classnames';

export type IconType = 'error' | 'info' | 'warning';

type Props = {
    type: IconType;
};

function Icon({ type }: Props) {
    // TODO: Feature - integrate fonts correctly
    const classes = classNames('material-icons', styles.icon);
    return <span className={classes}>{type}</span>;
}

export default Icon;
