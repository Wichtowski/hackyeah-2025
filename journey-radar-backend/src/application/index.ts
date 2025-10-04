import express from 'express';
import { JourneyRadarFacade } from '@domain/facade/JourneyRadarFacade';
import { createHealthRoutes } from '@adapter/rest/incoming/healthRoutes';
import { InMemoryIncidentReportRepository } from '@adapter/repository/InMemoryIncidentReportRepository';

const incidentReportRepository = new InMemoryIncidentReportRepository();
const journeyRadarFacade = new JourneyRadarFacade(incidentReportRepository);
const healthRouter = createHealthRoutes(journeyRadarFacade);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', healthRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
