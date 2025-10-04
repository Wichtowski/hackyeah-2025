import express from 'express';
import { JourneyRadarFacade } from '@domain/facade/JourneyRadarFacade';
import { createHealthRoutes } from '@adapter/rest/incoming/healthRoutes';
import { createIncidentRoutes } from '@adapter/rest/incoming/incidentRoutes';
import { InMemoryIncidentReportRepository } from '@adapter/repository/InMemoryIncidentReportRepository';
import { MockUserContextService } from '@adapter/service/MockUserContextService';

const incidentReportRepository = new InMemoryIncidentReportRepository();
const userContextService = new MockUserContextService();
const journeyRadarFacade = new JourneyRadarFacade(incidentReportRepository, userContextService);
const healthRouter = createHealthRoutes(journeyRadarFacade);
const incidentRouter = createIncidentRoutes(journeyRadarFacade);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', healthRouter);
app.use('/api', incidentRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
