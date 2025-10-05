import { enableApiDebug, configureApi } from './httpClient';
import { healthCheck } from './health';
import { reportIncident } from './incidents';
export type { HealthResult, Location, RouteReference, IncidentType, ReporterType, Reporter, IncidentReportDetails, CreateIncidentRequest, IncidentReport } from './types';
export { apiGet, apiPost, apiPut, apiPatch, apiDelete, getClient, normalizeApiError, type ApiError, isDebugEnabled, } from './httpClient';
export declare const apiClient: {
    healthCheck: typeof healthCheck;
    reportIncident: typeof reportIncident;
};
export { enableApiDebug, configureApi };
export default apiClient;
