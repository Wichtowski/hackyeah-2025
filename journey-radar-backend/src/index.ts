import express, { Request, Response } from 'express';
import healthRouter from './routes/health';
import cors from 'cors';
import { JourneyRadarFacade } from '@domain/facade/JourneyRadarFacade';
import { InMemoryIncidentReportRepository } from '@adapter/repository/InMemoryIncidentReportRepository';
import { InMemoryUserLocationRepository } from '@adapter/repository/InMemoryUserLocationRepository';
import { MockUserContextService } from '@adapter/service/MockUserContextService';
import { createIncidentRoutes } from '@adapter/rest/incoming/incidentRoutes';
import { createLocationMockRoutes } from '@adapter/rest/incoming/locationMockRoutes';
import { createJourneysRoutes } from '@adapter/rest/incoming/journeysRoutes';

const app = express();
const port = 3000;

// CORS configuration (allow common Expo dev origins + configurable env)
const defaultOrigins = ['http://localhost:8081', 'http://localhost:19006'];
const envOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Non-browser or same-origin
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // In dev, log the blocked origin for easier debugging
    console.warn(`[CORS] Blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  exposedHeaders: ['x-health-check'],
}));

// Parse JSON bodies for POST endpoints
app.use(express.json());

// Create facade and mount API routers
const incidentReportRepository = new InMemoryIncidentReportRepository();
const userLocationRepository = new InMemoryUserLocationRepository();
const userContextService = new MockUserContextService(userLocationRepository);
const journeyRadarFacade = new JourneyRadarFacade(incidentReportRepository, userContextService, userLocationRepository);

app.use('/api', healthRouter); // legacy health route shape expected by SDK tests
app.use('/api', createIncidentRoutes(journeyRadarFacade));
app.use('/api', createLocationMockRoutes(journeyRadarFacade));
app.use('/api', createJourneysRoutes(journeyRadarFacade));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from your new Express app!');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server for 'journey-radar-backend' is running at http://localhost:${port}`);
    console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ') || '(none)'}`);
  });
}

export default app;