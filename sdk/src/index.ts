import { enableApiDebug, configureApi } from './httpClient';
import { healthCheck } from './health';
import { reportIncident } from './incidents';
export type {
  HealthResult,
  Location,
  RouteReference,
  IncidentType,
  ReporterType,
  Reporter,
  IncidentReportDetails,
  CreateIncidentRequest,
  IncidentReport
} from './types';
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
  reportIncident,
};

export { enableApiDebug, configureApi };
export default apiClient;
