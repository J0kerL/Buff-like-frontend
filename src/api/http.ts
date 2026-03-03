import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';
import { useAuthStore } from '@/stores/auth';
import type { LoginVO, Result } from '@/types/api';

const SUCCESS_CODE = 200;
const UNAUTHORIZED_CODE = 401;
let refreshPromise: Promise<string> | null = null;

interface HttpInstance extends AxiosInstance {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 15000
}) as HttpInstance;

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const isRefreshRequest = (config?: InternalAxiosRequestConfig) =>
  Boolean(config?.url && config.url.includes('/auth/refresh'));

const buildError = (message: string) => new Error(message || 'Request failed');

const refreshAccessToken = async (): Promise<string> => {
  const authStore = useAuthStore();
  if (!authStore.refreshToken) {
    throw buildError('No refresh token');
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post<Result<LoginVO>>('/api/auth/refresh', null, {
        params: { refreshToken: authStore.refreshToken }
      })
      .then((refreshed) => {
        if (refreshed.data.code !== SUCCESS_CODE || !refreshed.data.data?.accessToken) {
          throw buildError(refreshed.data.message || 'Refresh token failed');
        }
        authStore.updateSession(refreshed.data.data);
        return refreshed.data.data.accessToken;
      })
      .catch((error: unknown) => {
        authStore.clearSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const retryWithRefresh = async (config: RetryableConfig) => {
  const authStore = useAuthStore();
  if (config._retry || isRefreshRequest(config) || !authStore.refreshToken) {
    authStore.clearSession();
    throw buildError('Invalid token');
  }

  config._retry = true;
  const token = await refreshAccessToken();
  if (!config.headers) {
    config.headers = {} as InternalAxiosRequestConfig['headers'];
  }
  config.headers.Authorization = `Bearer ${token}`;
  return instance(config);
};

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse<Result<unknown>>): any => {
    const result = response.data;
    if (result.code === SUCCESS_CODE) {
      return result.data;
    }

    if (result.code === UNAUTHORIZED_CODE) {
      return retryWithRefresh(response.config as RetryableConfig);
    }

    return Promise.reject(buildError(result.message || 'Request failed'));
  },
  async (error: AxiosError<Result<unknown>>): Promise<any> => {
    const status = error.response?.status;
    const responseCode = error.response?.data?.code;
    const originalConfig = error.config as RetryableConfig | undefined;

    if ((status === UNAUTHORIZED_CODE || responseCode === UNAUTHORIZED_CODE) && originalConfig) {
      return retryWithRefresh(originalConfig);
    }

    const message = error.response?.data?.message || error.message || 'Network error';
    return Promise.reject(buildError(message));
  }
);

export default instance;
