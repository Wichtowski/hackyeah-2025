import { getClient } from './httpClient';
import { HealthResult } from './types';

/** Perform a simple backend health check */
export async function healthCheck(): Promise<HealthResult> {
  const client = getClient();
  try {
    const response = await client.get('/health');
    // Return response body directly; header timestamp removed.
    return response.data as HealthResult;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Health check failed:', error);
    throw error;
  }
}
