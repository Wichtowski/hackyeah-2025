import { AxiosInstance } from 'axios';
/** Enable or disable verbose API logging (idempotent). */
export declare function enableApiDebug(enable?: boolean): void;
/** Reconfigure the underlying Axios client base URL (e.g. when using a device or tunnel). */
export declare function configureApi(options: {
    baseURL: string;
}): void;
/** Get the shared Axios instance (ensures interceptors are applied when debug is enabled). */
export declare function getClient(): AxiosInstance;
export declare function isDebugEnabled(): boolean;
