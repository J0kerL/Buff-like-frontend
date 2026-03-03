import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
const SUCCESS_CODE = 200;
const UNAUTHORIZED_CODE = 401;
let refreshPromise = null;
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '/api',
    timeout: 15000
});
const isRefreshRequest = (config) => Boolean(config?.url && config.url.includes('/auth/refresh'));
const buildError = (message) => new Error(message || 'Request failed');
const refreshAccessToken = async () => {
    const authStore = useAuthStore();
    if (!authStore.refreshToken) {
        throw buildError('No refresh token');
    }
    if (!refreshPromise) {
        refreshPromise = axios
            .post('/api/auth/refresh', null, {
            params: { refreshToken: authStore.refreshToken }
        })
            .then((refreshed) => {
            if (refreshed.data.code !== SUCCESS_CODE || !refreshed.data.data?.accessToken) {
                throw buildError(refreshed.data.message || 'Refresh token failed');
            }
            authStore.updateSession(refreshed.data.data);
            return refreshed.data.data.accessToken;
        })
            .catch((error) => {
            authStore.clearSession();
            throw error;
        })
            .finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
};
const retryWithRefresh = async (config) => {
    const authStore = useAuthStore();
    if (config._retry || isRefreshRequest(config) || !authStore.refreshToken) {
        authStore.clearSession();
        throw buildError('Invalid token');
    }
    config._retry = true;
    const token = await refreshAccessToken();
    if (!config.headers) {
        config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
    return instance(config);
};
instance.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
});
instance.interceptors.response.use((response) => {
    const result = response.data;
    if (result.code === SUCCESS_CODE) {
        return result.data;
    }
    if (result.code === UNAUTHORIZED_CODE) {
        return retryWithRefresh(response.config);
    }
    return Promise.reject(buildError(result.message || 'Request failed'));
}, async (error) => {
    const status = error.response?.status;
    const responseCode = error.response?.data?.code;
    const originalConfig = error.config;
    if ((status === UNAUTHORIZED_CODE || responseCode === UNAUTHORIZED_CODE) && originalConfig) {
        return retryWithRefresh(originalConfig);
    }
    const message = error.response?.data?.message || error.message || 'Network error';
    return Promise.reject(buildError(message));
});
export default instance;
