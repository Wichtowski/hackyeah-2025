"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const health_1 = __importDefault(require("./routes/health"));
const cors_1 = __importDefault(require("cors"));
const JourneyRadarFacade_1 = require("./domain/facade/JourneyRadarFacade");
const InMemoryIncidentReportRepository_1 = require("./adapter/repository/InMemoryIncidentReportRepository");
const InMemoryUserLocationRepository_1 = require("./adapter/repository/InMemoryUserLocationRepository");
const MockUserContextService_1 = require("./adapter/service/MockUserContextService");
const incidentRoutes_1 = require("./adapter/rest/incoming/incidentRoutes");
const locationMockRoutes_1 = require("./adapter/rest/incoming/locationMockRoutes");
const journeysRoutes_1 = require("./adapter/rest/incoming/journeysRoutes");
const InMemoryJourneyProgressRepository_1 = require("./adapter/repository/InMemoryJourneyProgressRepository");
const InMemoryFinishedJourneyRepository_1 = require("./adapter/repository/InMemoryFinishedJourneyRepository");
const app = (0, express_1.default)();
const port = 3000;
// CORS configuration (allow common Expo dev origins + configurable env)
const defaultOrigins = ['http://localhost:8081', 'http://localhost:19006'];
const envOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true); // Non-browser or same-origin
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        // In dev, log the blocked origin for easier debugging
        console.warn(`[CORS] Blocked origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
    },
    exposedHeaders: ['x-health-check'],
}));
// Parse JSON bodies for POST endpoints
app.use(express_1.default.json());
// Create facade and mount API routers
const incidentReportRepository = new InMemoryIncidentReportRepository_1.InMemoryIncidentReportRepository();
const userLocationRepository = new InMemoryUserLocationRepository_1.InMemoryUserLocationRepository();
const userContextService = new MockUserContextService_1.MockUserContextService(userLocationRepository);
const journeyProgressRepository = new InMemoryJourneyProgressRepository_1.InMemoryJourneyProgressRepository();
const finishedJourneyRepository = new InMemoryFinishedJourneyRepository_1.InMemoryFinishedJourneyRepository();
const journeyRadarFacade = new JourneyRadarFacade_1.JourneyRadarFacade(incidentReportRepository, userContextService, userLocationRepository, journeyProgressRepository, finishedJourneyRepository);
app.use('/api', health_1.default); // legacy health route shape expected by SDK tests
app.use('/api', (0, incidentRoutes_1.createIncidentRoutes)(journeyRadarFacade));
app.use('/api', (0, locationMockRoutes_1.createLocationMockRoutes)(journeyRadarFacade));
app.use('/api', (0, journeysRoutes_1.createJourneysRoutes)(journeyRadarFacade));
app.get('/', (req, res) => {
    res.send('Hello from your new Express app!');
});
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server for 'journey-radar-backend' is running at http://localhost:${port}`);
        console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ') || '(none)'}`);
    });
}
exports.default = app;
