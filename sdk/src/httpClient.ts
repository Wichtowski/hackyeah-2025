import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

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

// -------------------- Typed Helper Layer --------------------

/** Standardized error shape surfaced by helper methods */
export interface ApiError {
  status?: number;
  message: string;
  details?: unknown;
  raw?: unknown; // original error for advanced inspection
}

function toApiError(error: any): ApiError {
  if (error?.isAxiosError) {
    return {
      status: error.response?.status,
      message: error.response?.data?.message || error.message || 'Request failed',
      details: error.response?.data,
      raw: error,
    };
  }
  return { message: error?.message || 'Unknown error', raw: error };
}

async function unwrap<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    throw toApiError(err);
  }
}

/** Perform a typed GET request returning body as T */
export function apiGet<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return unwrap<T>(getClient().get<T>(url, config));
}

/** Perform a typed POST request returning body as R (response) with data payload D */
export function apiPost<R = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R> {
  return unwrap<R>(getClient().post<R>(url, data, config));
}

/** Perform a typed PUT request */
export function apiPut<R = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R> {
  return unwrap<R>(getClient().put<R>(url, data, config));
}

/** Perform a typed PATCH request */
export function apiPatch<R = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R> {
  return unwrap<R>(getClient().patch<R>(url, data, config));
}

/** Perform a typed DELETE request */
export function apiDelete<R = unknown>(url: string, config?: AxiosRequestConfig): Promise<R> {
  return unwrap<R>(getClient().delete<R>(url, config));
}

/** Expose a helper for direct error normalization if consumers catch raw errors */
export function normalizeApiError(error: unknown): ApiError {
  return toApiError(error);
}
