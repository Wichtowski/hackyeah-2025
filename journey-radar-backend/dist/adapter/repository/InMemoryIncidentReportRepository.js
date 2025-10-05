"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryIncidentReportRepository = void 0;
const IncidentReport_1 = require("../../domain/model/IncidentReport");
class InMemoryIncidentReportRepository {
    incidents = new Map();
    async save(incidentReport) {
        // Generate ID if not provided (using timestamp-based ID)
        const id = incidentReport.id || this.generateId();
        const reportWithId = new IncidentReport_1.IncidentReport(id, incidentReport.location, incidentReport.reporter, incidentReport.incidentType, incidentReport.details, incidentReport.timestamp, incidentReport.description);
        this.incidents.set(reportWithId.id, reportWithId);
        return reportWithId;
    }
    async findById(id) {
        return this.incidents.get(id) || null;
    }
    async findAll() {
        return Array.from(this.incidents.values());
    }
    async findByLocation(longitude, latitude, radiusKm) {
        const incidents = Array.from(this.incidents.values());
        return incidents.filter(incident => {
            const distance = this.calculateDistance(latitude, longitude, incident.location.latitude, incident.location.longitude);
            return distance <= radiusKm;
        });
    }
    async findByRoute(origin, destination) {
        const incidents = Array.from(this.incidents.values());
        return incidents.filter(incident => {
            const route = incident.details.reportedOnRoute;
            return route && route.origin === origin && route.destination === destination;
        });
    }
    // Haversine formula to calculate distance between two coordinates in km
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    generateId() {
        return `incident-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
}
exports.InMemoryIncidentReportRepository = InMemoryIncidentReportRepository;
