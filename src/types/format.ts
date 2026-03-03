import dayjs from 'dayjs';

export const formatDateTime = (value?: string) => {
  if (!value) {
    return '-';
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
};

export const money = (value?: number | string) => {
  const amount = Number(value ?? 0);
  return amount.toFixed(2);
};

export const wearText = (wear?: number | string) => {
  const num = Number(wear ?? 0);
  return num.toFixed(4);
};

