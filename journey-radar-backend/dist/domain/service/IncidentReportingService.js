"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentReportingService = void 0;
const IncidentReport_1 = require("../model/IncidentReport");
class IncidentReportingService {
    incidentReportRepository;
    userContextService;
    constructor(incidentReportRepository, userContextService) {
        this.incidentReportRepository = incidentReportRepository;
        this.userContextService = userContextService;
    }
    async reportIncident(userId, incidentType, description) {
        const location = await this.userContextService.getCurrentLocation(userId);
        const reporter = await this.userContextService.getReporter(userId);
        const activeJourney = await this.userContextService.getActiveJourney(userId);
        const incidentReport = new IncidentReport_1.IncidentReport('', location, reporter, incidentType, { reportedOnRoute: activeJourney }, new Date(), description);
        return await this.incidentReportRepository.save(incidentReport);
    }
}
exports.IncidentReportingService = IncidentReportingService;
