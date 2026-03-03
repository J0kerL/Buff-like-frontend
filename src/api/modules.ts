import http from '@/api/http';
import type { InventoryItem, InventoryStatistics, LoginVO, MarketListing, OrderItem, PageResult, User, WalletLog } from '@/types/api';

export const authApi = {
  login(data: { username: string; password: string }) {
    return http.post<LoginVO>('/auth/login', data);
  },
  register(data: { username: string; password: string; mobile: string; code: string }) {
    return http.post<LoginVO>('/auth/register', data);
  },
  sendCode(mobile: string) {
    return http.post<string>('/auth/code', null, { params: { mobile } });
  },
  logout(refreshToken: string) {
    return http.post<void>('/auth/logout', null, { params: { refreshToken } });
  }
};

export const userApi = {
  current() {
    return http.get<User>('/user/current');
  },
  bindSteam(steamId: string) {
    return http.post<void>('/user/bind-steam', null, { params: { steamId } });
  }
};

export const inventoryApi = {
  list(params: Record<string, unknown>) {
    return http.get<PageResult<InventoryItem>>('/inventory/my', { params });
  },
  statistics() {
    return http.get<InventoryStatistics>('/inventory/statistics');
  }
};

export const marketApi = {
  listings(params: Record<string, unknown>) {
    return http.get<PageResult<MarketListing>>('/market/listings', { params });
  },
  myListings(params: Record<string, unknown>) {
    return http.get<PageResult<MarketListing>>('/market/my-listings', { params });
  },
  createListing(data: { inventoryId: number; price: number }) {
    return http.post<number>('/market/list', data);
  },
  cancelListing(id: number) {
    return http.delete<void>(`/market/list/${id}`);
  }
};

export const orderApi = {
  create(listingId: number) {
    return http.post<string>('/order/create', { listingId });
  },
  pay(id: number) {
    return http.post<void>(`/order/${id}/pay`);
  },
  deliver(id: number) {
    return http.post<void>(`/order/${id}/deliver`);
  },
  confirm(id: number) {
    return http.post<void>(`/order/${id}/confirm`);
  },
  cancel(id: number) {
    return http.post<void>(`/order/${id}/cancel`);
  },
  myBuy(params: Record<string, unknown>) {
    return http.get<PageResult<OrderItem>>('/order/my-buy-orders', { params });
  },
  mySell(params: Record<string, unknown>) {
    return http.get<PageResult<OrderItem>>('/order/my-sell-orders', { params });
  }
};

export const walletApi = {
  balance() {
    return http.get<number>('/wallet/balance');
  },
  recharge(amount: number) {
    return http.post<void>('/wallet/recharge', { amount });
  },
  withdraw(amount: number) {
    return http.post<void>('/wallet/withdraw', { amount });
  },
  logs(params: Record<string, unknown>) {
    return http.get<PageResult<WalletLog>>('/wallet/logs', { params });
  }
};

