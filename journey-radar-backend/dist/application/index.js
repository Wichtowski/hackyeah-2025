"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JourneyRadarFacade_1 = require("../domain/facade/JourneyRadarFacade");
const healthRoutes_1 = require("../adapter/rest/incoming/healthRoutes");
const incidentRoutes_1 = require("../adapter/rest/incoming/incidentRoutes");
const locationMockRoutes_1 = require("../adapter/rest/incoming/locationMockRoutes");
const journeysRoutes_1 = require("../adapter/rest/incoming/journeysRoutes");
const InMemoryIncidentReportRepository_1 = require("../adapter/repository/InMemoryIncidentReportRepository");
const InMemoryUserLocationRepository_1 = require("../adapter/repository/InMemoryUserLocationRepository");
const MockUserContextService_1 = require("../adapter/service/MockUserContextService");
const incidentReportRepository = new InMemoryIncidentReportRepository_1.InMemoryIncidentReportRepository();
const userLocationRepository = new InMemoryUserLocationRepository_1.InMemoryUserLocationRepository();
const userContextService = new MockUserContextService_1.MockUserContextService(userLocationRepository);
const journeyRadarFacade = new JourneyRadarFacade_1.JourneyRadarFacade(incidentReportRepository, userContextService, userLocationRepository);
const healthRouter = (0, healthRoutes_1.createHealthRoutes)(journeyRadarFacade);
const incidentRouter = (0, incidentRoutes_1.createIncidentRoutes)(journeyRadarFacade);
const locationMockRouter = (0, locationMockRoutes_1.createLocationMockRoutes)(journeyRadarFacade);
const journeysRouter = (0, journeysRoutes_1.createJourneysRoutes)(journeyRadarFacade);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/api', healthRouter);
app.use('/api', incidentRouter);
app.use('/api', locationMockRouter);
app.use('/api', journeysRouter);
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
exports.default = app;
