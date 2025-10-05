import { Router, Request, Response } from 'express';
import { JourneyRadarCapabilities } from '@domain/facade/JourneyRadarCapabilities';
import { IncidentType } from '@domain/model/IncidentReport';

export function createIncidentRoutes(facade: JourneyRadarCapabilities): Router {
  const router = Router();

  // POST /incidents - Create a new incident report
  router.post('/incidents', async (req: Request, res: Response) => {
    try {
      const { userId, incidentType, description } = req.body;


      // Validation
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'Valid userId is required' });
      }

      if (!incidentType || !Object.values(IncidentType).includes(incidentType)) {
        return res.status(400).json({ error: 'Valid incident type is required (ISSUES, DELAY, or SEVERE_BLOCKER)' });
      }

      // Report incident - location, reporter, and route details will be inferred from user context
      const savedIncident = await facade.reportIncident(userId, incidentType, description);

      res.status(201).json({
        id: savedIncident.id,
        location: savedIncident.location,
        reporter: savedIncident.reporter,
        incidentType: savedIncident.incidentType,
        details: savedIncident.details,
        timestamp: savedIncident.timestamp,
        description: savedIncident.description
      });
    } catch (error) {
      console.error('Error creating incident report:', error);
      res.status(500).json({ error: 'Failed to create incident report' });
    }
  });

  return router;
}
