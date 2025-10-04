import { enableApiDebug, configureApi } from './httpClient';
import { healthCheck } from './health';
export type { HealthResult } from './types';

// Public API client object (backwards compatible with previous shape)
export const apiClient = {
  healthCheck,
};

export { enableApiDebug, configureApi };
export default apiClient;
