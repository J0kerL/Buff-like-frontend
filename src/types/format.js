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
    return num.toFixed(4);
};
