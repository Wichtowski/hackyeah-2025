import { apiClient, configureApi, enableApiDebug } from '../../src';
import type { Server } from 'http';

let server: Server;
let baseUrl: string;

describe('SDK integration - health endpoint', () => {
  beforeAll(async () => {
    // Ensure backend does not auto-start when we import it
    process.env.NODE_ENV = 'test';
    // Import compiled backend app (built via pretest script)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const backend = require('../../../journey-radar-backend/dist/index.js');
    const app = backend.default || backend.app || backend;
    await new Promise<void>((resolve, reject) => {
      server = app.listen(0, () => resolve());
      server.on('error', reject);
    });
    const address = server.address();
    if (address && typeof address === 'object') {
      baseUrl = `http://127.0.0.1:${address.port}/api`;
    } else {
      throw new Error('Failed to determine server port');
    }
    configureApi({ baseURL: baseUrl });
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  test('healthCheck returns expected message', async () => {
    const result = await apiClient.healthCheck();
    expect(result).toEqual({ message: 'ok from backend' });
  });

  test('healthCheck still works with debug enabled', async () => {
    enableApiDebug(true);
    const result = await apiClient.healthCheck();
    expect(result.message).toBe('ok from backend');
  });
});

