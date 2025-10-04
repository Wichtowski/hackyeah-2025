import { apiPost } from './httpClient';
import { CreateIncidentRequest, IncidentReport } from './types';

/**
 * Report a new incident on a route
 * @param baseUrl - The base URL of the Journey Radar API
 * @param incidentData - The incident report data
 * @returns Promise with the created incident report
 */
export async function reportIncident(
  baseUrl: string,
  incidentData: CreateIncidentRequest
): Promise<IncidentReport> {
  return apiPost<IncidentReport, CreateIncidentRequest>(`${baseUrl}/api/incidents`, incidentData);
}
