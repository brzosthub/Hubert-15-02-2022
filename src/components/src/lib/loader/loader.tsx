import * as React from 'react';
import styles from './loader.module.scss';
import classNames from 'classnames';

function Loader() {
    const classes = classNames(styles.loader, {
        [styles.loader_animating]: !window.Cypress,
    });
    return <div className={classes} />;
}

export default Loader;
