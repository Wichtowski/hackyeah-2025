import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface HealthResult {
  message: string;
  headerTimestamp?: string; // raw ISO timestamp from x-health-check header
}

let API_BASE_URL = 'http://localhost:3000/api';
let debugEnabled = false;
let interceptorsApplied = false;

let client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

function applyInterceptors() {
  if (interceptorsApplied) return;
  client.interceptors.request.use((config) => {
    if (debugEnabled) {
      // eslint-disable-next-line no-console
      console.log(`[SDK][request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  });
  client.interceptors.response.use(
    (res: AxiosResponse) => {
      if (debugEnabled) {
        // eslint-disable-next-line no-console
        console.log(`[SDK][response] ${res.status} ${res.config.url}`, res.data);
      }
      return res;
    },
    (error) => {
      if (debugEnabled) {
        // eslint-disable-next-line no-console
        console.log('[SDK][error]', error?.response?.status, error?.message);
      }
      return Promise.reject(error);
    }
  );
  interceptorsApplied = true;
}

/** Enable or disable verbose API logging */
export const enableApiDebug = (enable: boolean = true) => {
  debugEnabled = enable;
  applyInterceptors();
};

/**
 * Reconfigure the underlying Axios client base URL (e.g. when using a device or tunnel).
 */
export const configureApi = (options: { baseURL: string }) => {
  API_BASE_URL = options.baseURL;
  client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
  });
  // Always reset interceptors so they can be re-applied for the new client
  interceptorsApplied = false;
  if (debugEnabled) {
    applyInterceptors();
  }
};

export const apiClient = {
  /** Perform a simple backend health check */
  healthCheck: async (): Promise<HealthResult> => {
    try {
      const response = await client.get('/health');
      const headerTs = response.headers['x-health-check'];
      return { ...response.data, headerTimestamp: headerTs };
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};

export default apiClient;
