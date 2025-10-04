import { apiGet } from './httpClient';
import { HealthResult } from './types';

/** Perform a simple backend health check */
export async function healthCheck(): Promise<HealthResult> {
  try {
    return await apiGet<HealthResult>('/health');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Health check failed:', error);
    throw error;
  }
}
