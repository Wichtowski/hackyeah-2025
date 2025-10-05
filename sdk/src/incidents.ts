import { apiPost, configureApi } from './httpClient';
import { CreateIncidentRequest, IncidentReport } from './types';

/**
 * Report a new incident on a route
 * @param incidentData - The incident report data
 * @returns Promise with the created incident report
 */
export async function reportIncident(incidentData: CreateIncidentRequest): Promise<IncidentReport>;
export async function reportIncident(baseURL: string, incidentData: CreateIncidentRequest): Promise<IncidentReport>;
export async function reportIncident(arg1: any, arg2?: any): Promise<IncidentReport> {
  let data: CreateIncidentRequest;
  if (typeof arg1 === 'string') {
    const baseURL: string = arg1;
    data = arg2 as CreateIncidentRequest;
    // Back-compat path used by some tests: explicit baseURL provided
    configureApi({ baseURL: baseURL.endsWith('/api') ? baseURL : `${baseURL}/api` });
  } else {
    data = arg1 as CreateIncidentRequest;
    // Assume configureApi already called by consumer/test suite
  }
  return apiPost<IncidentReport, CreateIncidentRequest>('/incidents', data);
}
