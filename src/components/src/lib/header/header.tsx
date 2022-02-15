import * as React from 'react';
import classNames from 'classnames';
import styles from './header.module.scss';

type Props = {
    dataTestId?: string;
    isPrimary?: boolean;
    className?: string;
    children: React.ReactNode;
};

function Header({ className, dataTestId, isPrimary, children }: Props) {
    const classes = classNames(className, styles.header, {
        [styles.header_primary]: isPrimary,
    });

    const TagName = isPrimary ? 'h1' : 'h2';

    return (
        <TagName className={classes} data-test-id={dataTestId}>
            {children}
        </TagName>
    );
}

export default Header;
