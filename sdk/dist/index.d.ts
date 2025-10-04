import { enableApiDebug, configureApi } from './httpClient';
import { healthCheck } from './health';
export type { HealthResult } from './types';
export { apiGet, apiPost, apiPut, apiPatch, apiDelete, getClient, normalizeApiError, type ApiError, isDebugEnabled, } from './httpClient';
export declare const apiClient: {
    healthCheck: typeof healthCheck;
};
export { enableApiDebug, configureApi };
export default apiClient;
