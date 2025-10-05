"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyRadarFacade = void 0;
const JourneyService_1 = require("../service/JourneyService");
const JourneyProgressService_1 = require("../service/JourneyProgressService");
const InMemoryJourneyProgressRepository_1 = require("../../adapter/repository/InMemoryJourneyProgressRepository");
const JourneySessionService_1 = require("../service/JourneySessionService");
const IncidentReportingService_1 = require("../service/IncidentReportingService");
const FinishedJourneyService_1 = require("../service/FinishedJourneyService");
const JourneyProgressOrchestrator_1 = require("../service/JourneyProgressOrchestrator");
const sessions = new Map();
const journeyIdToStartedAt = new Map();
const journeyIdToUserId = new Map();
class JourneyRadarFacade {
    incidentReportRepository;
    userContextService;
    userLocationRepository;
    finishedJourneyRepository;
    journeyService;
    journeyProgressService;
    journeySessionService;
    incidentReportingService;
    finishedJourneyService;
    progressOrchestrator;
    constructor(incidentReportRepository, userContextService, userLocationRepository, journeyProgressRepository, finishedJourneyRepository, journeyService = new JourneyService_1.JourneyService(incidentReportRepository)) {
        this.incidentReportRepository = incidentReportRepository;
        this.userContextService = userContextService;
        this.userLocationRepository = userLocationRepository;
        this.finishedJourneyRepository = finishedJourneyRepository;
        this.journeyService = journeyService;
        const repo = journeyProgressRepository ?? new InMemoryJourneyProgressRepository_1.InMemoryJourneyProgressRepository();
        this.journeyProgressService = new JourneyProgressService_1.JourneyProgressService(repo);
        this.journeySessionService = new JourneySessionService_1.JourneySessionService();
        this.incidentReportingService = new IncidentReportingService_1.IncidentReportingService(incidentReportRepository, userContextService);
        this.finishedJourneyService = new FinishedJourneyService_1.FinishedJourneyService(finishedJourneyRepository);
        this.progressOrchestrator = new JourneyProgressOrchestrator_1.JourneyProgressOrchestrator(this.journeyService, this.journeyProgressService, this.journeySessionService, this.finishedJourneyService);
    }
    async checkHealth() {
        return { status: 'OK', domain: 'JourneyRadar' };
    }
    async reportIncident(userId, incidentType, description) {
        const saved = await this.incidentReportingService.reportIncident(userId, incidentType, description);
        // If incident is tied to a route, update all active journeys matching that route
        const routeRef = saved.details.reportedOnRoute;
        if (routeRef) {
            const sessions = this.journeySessionService.getAllSessions();
            for (const { journeyId, journey } of sessions) {
                // Determine if any route in journey matches the origin/destination by names
                const matches = journey.routes.some(r => {
                    const first = r.stations[0]?.name;
                    const last = r.stations[r.stations.length - 1]?.name;
                    return first === routeRef.origin && last === routeRef.destination;
                });
                if (!matches)
                    continue;
                // Recompute incidents for each matching route using JourneyService mapping
                const updatedRoutes = await Promise.all(journey.routes.map(async (r) => {
                    const first = r.stations[0]?.name;
                    const last = r.stations[r.stations.length - 1]?.name;
                    if (first === routeRef.origin && last === routeRef.destination) {
                        // compute incidents for this route only
                        const incidents = await this.journeyService.findIncidentsForRoute(first, last, r.stations);
                        return { ...r, incidents };
                    }
                    return r;
                }));
                const updatedJourney = { ...journey, routes: updatedRoutes };
                this.journeySessionService.setJourney(journeyId, updatedJourney);
            }
        }
        return saved;
    }
    async mockUserLocation(userId, longitude, latitude) {
        console.log(`Domain: Mocking location for user ${userId} at (${latitude}, ${longitude})`);
        await this.userLocationRepository.saveLocation({
            userId,
            longitude,
            latitude,
            timestamp: new Date()
        });
        return { userId, longitude, latitude };
    }
    async getJourney(origin, destination) {
        return this.journeyService.computeJourney(origin, destination);
    }
    async startJourney(journey) {
        return this.journeySessionService.startJourney(journey);
    }
    async getJourneyProgress(journeyId, coordinates, userId) {
        return this.progressOrchestrator.computeAndPersist(journeyId, coordinates, userId);
    }
    async getFinishedJourneys(userId) {
        return this.finishedJourneyService.findByUserId(userId);
    }
}
exports.JourneyRadarFacade = JourneyRadarFacade;
