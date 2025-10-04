import { enableApiDebug, configureApi } from './httpClient';
import { healthCheck } from './health';
export type { HealthResult } from './types';
export declare const apiClient: {
    healthCheck: typeof healthCheck;
};
export { enableApiDebug, configureApi };
export default apiClient;
