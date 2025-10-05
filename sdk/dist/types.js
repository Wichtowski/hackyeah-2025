"use strict";
// Central SDK shared TypeScript types
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporterType = exports.IncidentType = void 0;
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
