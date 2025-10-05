import express from 'express';
import cors from 'cors';
import { JourneyRadarFacade } from '@domain/facade/JourneyRadarFacade';
import { createHealthRoutes } from '@adapter/rest/incoming/healthRoutes';
import { createIncidentRoutes } from '@adapter/rest/incoming/incidentRoutes';
import { createLocationMockRoutes } from '@adapter/rest/incoming/locationMockRoutes';
import { createJourneysRoutes } from '@adapter/rest/incoming/journeysRoutes';
import { InMemoryIncidentReportRepository } from '@adapter/repository/InMemoryIncidentReportRepository';
import { InMemoryUserLocationRepository } from '@adapter/repository/InMemoryUserLocationRepository';
import { MockUserContextService } from '@adapter/service/MockUserContextService';

const incidentReportRepository = new InMemoryIncidentReportRepository();
const userLocationRepository = new InMemoryUserLocationRepository();
const userContextService = new MockUserContextService(userLocationRepository);
const journeyRadarFacade = new JourneyRadarFacade(incidentReportRepository, userContextService, userLocationRepository);
const healthRouter = createHealthRoutes(journeyRadarFacade);
const incidentRouter = createIncidentRoutes(journeyRadarFacade);
const locationMockRouter = createLocationMockRoutes(journeyRadarFacade);
const journeysRouter = createJourneysRoutes(journeyRadarFacade);

const app = express();
const PORT = process.env.PORT || 3000;

const defaultOrigins = ['http://localhost:8081', 'http://localhost:19006'];
const envOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  exposedHeaders: ['x-health-check'],
}));

app.use(express.json());
app.use('/api', healthRouter);
app.use('/api', incidentRouter);
app.use('/api', locationMockRouter);
app.use('/api', journeysRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
  });
}

export default app;
