import { enableApiDebug, configureApi } from './httpClient';
import { healthCheck } from './health';
export type { HealthResult } from './types';
// New exports for typed HTTP helpers
export {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  getClient,
  normalizeApiError,
  type ApiError,
  isDebugEnabled,
} from './httpClient';

// Public API client object (backwards compatible with previous shape)
export const apiClient = {
  healthCheck,
};

export { enableApiDebug, configureApi };
export default apiClient;
