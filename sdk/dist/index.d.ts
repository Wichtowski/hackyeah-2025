import { enableApiDebug, configureApi } from './httpClient';
import { healthCheck } from './health';
import { reportIncident } from './incidents';
import { getJourney, startJourney, getJourneyStage } from './journeys';
export type { HealthResult, Location, RouteReference, IncidentType, ReporterType, Reporter, IncidentReportDetails, CreateIncidentRequest, IncidentReport, ApiClient as ApiClientType, Origin, Destination, Coordinates, Journey, JourneyStartResponse, JourneyProgress, } from './types';
export { apiGet, apiPost, apiPut, apiPatch, apiDelete, getClient, normalizeApiError, type ApiError, isDebugEnabled, } from './httpClient';
export declare const apiClient: {
    healthCheck: typeof healthCheck;
    reportIncident: typeof reportIncident;
    getJourney: typeof getJourney;
    startJourney: typeof startJourney;
    getJourneyStage: typeof getJourneyStage;
};
export { enableApiDebug, configureApi };
export default apiClient;
