import { enableApiDebug, configureApi } from './httpClient';
import { healthCheck } from './health';
import { reportIncident } from './incidents';
import { getJourney, startJourney, getJourneyStage, getJourneyStageWithUser, getJourneyHistory } from './journeys';
export type {
  HealthResult,
  Location,
  RouteReference,
  IncidentType,
  ReporterType,
  Reporter,
  IncidentReportDetails,
  CreateIncidentRequest,
  IncidentReport,
  ApiClient as ApiClientType,
  Origin,
  Destination,
  Coordinates,
  Journey,
  JourneyStartResponse,
  JourneyProgress,
  FinishedJourney,
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

// Public API client object (extended)
export const apiClient = {
  healthCheck,
  reportIncident,
  getJourney,
  startJourney,
  getJourneyStage,
  getJourneyStageWithUser,
  getJourneyHistory,
};

export { enableApiDebug, configureApi };
export default apiClient;
