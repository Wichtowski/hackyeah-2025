import { AxiosInstance, AxiosRequestConfig } from 'axios';
/** Enable or disable verbose API logging (idempotent). */
export declare function enableApiDebug(enable?: boolean): void;
/** Reconfigure the underlying Axios client base URL (e.g. when using a device or tunnel). */
export declare function configureApi(options: {
    baseURL: string;
}): void;
/** Get the shared Axios instance (ensures interceptors are applied when debug is enabled). */
export declare function getClient(): AxiosInstance;
export declare function isDebugEnabled(): boolean;
/** Standardized error shape surfaced by helper methods */
export interface ApiError {
    status?: number;
    message: string;
    details?: unknown;
    raw?: unknown;
}
/** Perform a typed GET request returning body as T */
export declare function apiGet<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
/** Perform a typed POST request returning body as R (response) with data payload D */
export declare function apiPost<R = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R>;
/** Perform a typed PUT request */
export declare function apiPut<R = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R>;
/** Perform a typed PATCH request */
export declare function apiPatch<R = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R>;
/** Perform a typed DELETE request */
export declare function apiDelete<R = unknown>(url: string, config?: AxiosRequestConfig): Promise<R>;
/** Expose a helper for direct error normalization if consumers catch raw errors */
export declare function normalizeApiError(error: unknown): ApiError;
