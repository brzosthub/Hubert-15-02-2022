export const DEFAULT_LOCALE = 'en-US';

export const percentageFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'percent',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});

export const priceFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});

export const sizeFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
    minimumFractionDigits: 0,
});
