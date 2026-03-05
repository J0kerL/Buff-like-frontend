import dayjs from 'dayjs';
export const formatDateTime = (value) => {
    if (!value) {
        return '-';
    }
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
};
export const money = (value) => {
    const amount = Number(value ?? 0);
    return amount.toFixed(2);
};
export const wearText = (wear) => {
    const num = Number(wear ?? 0);
    if (num < 0.07) return '崭新出厂';
    if (num < 0.15) return '略有磨损';
    if (num < 0.37) return '久经沙场';
    if (num < 0.44) return '破损不堪';
    return '战痕累累';
};
export const wearRange = wearText;
export const wearRangeBounds = (label) => {
    switch (label) {
        case '崭新出厂': return [0, 0.07];
        case '略有磨损': return [0.07, 0.15];
        case '久经沙场': return [0.15, 0.37];
        case '破损不堪': return [0.37, 0.44];
        case '战痕累累': return [0.44, 1.0];
        default: return [0, 1.0];
    }
};
