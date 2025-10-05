import { apiPost } from './httpClient';
import { CreateIncidentRequest, IncidentReport } from './types';

/**
 * Report a new incident on a route
 * @param incidentData - The incident report data
 * @returns Promise with the created incident report
 */
export async function reportIncident(
  incidentData: CreateIncidentRequest
): Promise<IncidentReport> {
  return apiPost<IncidentReport, CreateIncidentRequest>('/incidents', incidentData);
}
