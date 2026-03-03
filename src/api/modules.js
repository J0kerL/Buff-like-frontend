import http from '@/api/http';
export const authApi = {
    login(data) {
        return http.post('/auth/login', data);
    },
    register(data) {
        return http.post('/auth/register', data);
    },
    sendCode(mobile) {
        return http.post('/auth/code', null, { params: { mobile } });
    },
    logout(refreshToken) {
        return http.post('/auth/logout', null, { params: { refreshToken } });
    }
};
export const userApi = {
    current() {
        return http.get('/user/current');
    },
    bindSteam(steamId) {
        return http.post('/user/bind-steam', null, { params: { steamId } });
    }
};
export const inventoryApi = {
    list(params) {
        return http.get('/inventory/my', { params });
    },
    statistics() {
        return http.get('/inventory/statistics');
    }
};
export const marketApi = {
    listings(params) {
        return http.get('/market/listings', { params });
    },
    myListings(params) {
        return http.get('/market/my-listings', { params });
    },
    createListing(data) {
        return http.post('/market/list', data);
    },
    cancelListing(id) {
        return http.delete(`/market/list/${id}`);
    },
    hotItems(params) {
        return http.get('/market/hot-items', { params });
    }
};
export const orderApi = {
    create(listingId) {
        return http.post('/order/create', { listingId });
    },
    pay(id) {
        return http.post(`/order/${id}/pay`);
    },
    deliver(id) {
        return http.post(`/order/${id}/deliver`);
    },
    confirm(id) {
        return http.post(`/order/${id}/confirm`);
    },
    cancel(id) {
        return http.post(`/order/${id}/cancel`);
    },
    myBuy(params) {
        return http.get('/order/my-buy-orders', { params });
    },
    mySell(params) {
        return http.get('/order/my-sell-orders', { params });
    }
};
export const walletApi = {
    balance() {
        return http.get('/wallet/balance');
    },
    recharge(amount) {
        return http.post('/wallet/recharge', { amount });
    },
    withdraw(amount) {
        return http.post('/wallet/withdraw', { amount });
    },
    logs(params) {
        return http.get('/wallet/logs', { params });
    }
};
