"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentReport = exports.ReporterType = exports.IncidentType = void 0;
var IncidentType;
(function (IncidentType) {
    IncidentType["ISSUES"] = "ISSUES";
    IncidentType["DELAY"] = "DELAY";
    IncidentType["SEVERE_BLOCKER"] = "SEVERE_BLOCKER";
})(IncidentType || (exports.IncidentType = IncidentType = {}));
var ReporterType;
(function (ReporterType) {
    ReporterType["USER"] = "USER";
    ReporterType["DISPATCHER"] = "DISPATCHER";
    ReporterType["EXTERNAL_SYSTEM"] = "EXTERNAL_SYSTEM";
})(ReporterType || (exports.ReporterType = ReporterType = {}));
class IncidentReport {
    id;
    location;
    reporter;
    incidentType;
    details;
    timestamp;
    description;
    constructor(id, location, reporter, incidentType, details, timestamp, description) {
        this.id = id;
        this.location = location;
        this.reporter = reporter;
        this.incidentType = incidentType;
        this.details = details;
        this.timestamp = timestamp;
        this.description = description;
    }
}
exports.IncidentReport = IncidentReport;
