import { defineStore } from 'pinia';
import { authApi, userApi } from '@/api/modules';
const ACCESS_KEY = 'buff_access_token';
const REFRESH_KEY = 'buff_refresh_token';
const USER_KEY = 'buff_user';
const safeParseUser = () => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        localStorage.removeItem(USER_KEY);
        return null;
    }
};
export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: localStorage.getItem(ACCESS_KEY) || '',
        refreshToken: localStorage.getItem(REFRESH_KEY) || '',
        user: safeParseUser()
    }),
    actions: {
        updateSession(payload) {
            this.accessToken = payload.accessToken;
            this.refreshToken = payload.refreshToken;
            this.user = payload.user;
            localStorage.setItem(ACCESS_KEY, payload.accessToken);
            localStorage.setItem(REFRESH_KEY, payload.refreshToken);
            localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
        },
        async login(username, password) {
            const data = await authApi.login({ username, password });
            this.updateSession(data);
            return data;
        },
        async register(payload) {
            const data = await authApi.register(payload);
            this.updateSession(data);
            return data;
        },
        async loadCurrentUser() {
            const user = await userApi.current();
            this.user = user;
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        },
        async logout() {
            if (this.refreshToken) {
                try {
                    await authApi.logout(this.refreshToken);
                }
                catch {
                    // ignore logout errors and clear local session
                }
            }
            this.clearSession();
        },
        clearSession() {
            this.accessToken = '';
            this.refreshToken = '';
            this.user = null;
            localStorage.removeItem(ACCESS_KEY);
            localStorage.removeItem(REFRESH_KEY);
            localStorage.removeItem(USER_KEY);
        }
    }
});
