import { Router, Request, Response } from 'express';
import { JourneyRadarCapabilities } from '@domain/facade/JourneyRadarCapabilities';

export const createHealthRoutes = (facade: JourneyRadarCapabilities): Router => {
  const router = Router();

  router.get('/health', async (req: Request, res: Response) => {
    try {
      const healthStatus = await facade.checkHealth();
      res.status(200).json(healthStatus);
    } catch (error) {
      res.status(500).json({ status: 'ERROR', message: 'Internal Server Error' });
    }
  });

  return router;
};
