import axios, { AxiosInstance, AxiosResponse } from 'axios';

/** Internal mutable state for the SDK HTTP layer */
let API_BASE_URL = 'http://localhost:3000/api';
let debugEnabled = false;
let interceptorsApplied = false;
let client: AxiosInstance = createAxiosInstance();

function createAxiosInstance(): AxiosInstance {
  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
  });
}

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

/** Enable or disable verbose API logging (idempotent). */
export function enableApiDebug(enable: boolean = true) {
  debugEnabled = enable;
  applyInterceptors();
}

/** Reconfigure the underlying Axios client base URL (e.g. when using a device or tunnel). */
export function configureApi(options: { baseURL: string }) {
  API_BASE_URL = options.baseURL;
  client = createAxiosInstance();
  // Reset interceptors so they can be re-applied on demand
  interceptorsApplied = false;
  if (debugEnabled) applyInterceptors();
}

/** Get the shared Axios instance (ensures interceptors are applied when debug is enabled). */
export function getClient(): AxiosInstance {
  // If debug was enabled after a reconfigure ensure interceptors are applied.
  if (debugEnabled && !interceptorsApplied) applyInterceptors();
  return client;
}

export function isDebugEnabled() {
  return debugEnabled;
}

