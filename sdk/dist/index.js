"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApi = exports.enableApiDebug = exports.apiClient = exports.isDebugEnabled = exports.normalizeApiError = exports.getClient = exports.apiDelete = exports.apiPatch = exports.apiPut = exports.apiPost = exports.apiGet = void 0;
const httpClient_1 = require("./httpClient");
Object.defineProperty(exports, "enableApiDebug", { enumerable: true, get: function () { return httpClient_1.enableApiDebug; } });
Object.defineProperty(exports, "configureApi", { enumerable: true, get: function () { return httpClient_1.configureApi; } });
const health_1 = require("./health");
const incidents_1 = require("./incidents");
const journeys_1 = require("./journeys");
// New exports for typed HTTP helpers
var httpClient_2 = require("./httpClient");
Object.defineProperty(exports, "apiGet", { enumerable: true, get: function () { return httpClient_2.apiGet; } });
Object.defineProperty(exports, "apiPost", { enumerable: true, get: function () { return httpClient_2.apiPost; } });
Object.defineProperty(exports, "apiPut", { enumerable: true, get: function () { return httpClient_2.apiPut; } });
Object.defineProperty(exports, "apiPatch", { enumerable: true, get: function () { return httpClient_2.apiPatch; } });
Object.defineProperty(exports, "apiDelete", { enumerable: true, get: function () { return httpClient_2.apiDelete; } });
Object.defineProperty(exports, "getClient", { enumerable: true, get: function () { return httpClient_2.getClient; } });
Object.defineProperty(exports, "normalizeApiError", { enumerable: true, get: function () { return httpClient_2.normalizeApiError; } });
Object.defineProperty(exports, "isDebugEnabled", { enumerable: true, get: function () { return httpClient_2.isDebugEnabled; } });
// Public API client object (extended)
exports.apiClient = {
    healthCheck: health_1.healthCheck,
    reportIncident: incidents_1.reportIncident,
    getJourney: journeys_1.getJourney,
    startJourney: journeys_1.startJourney,
    getJourneyStage: journeys_1.getJourneyStage,
    getJourneyStageWithUser: journeys_1.getJourneyStageWithUser,
    getJourneyHistory: journeys_1.getJourneyHistory,
};
exports.default = exports.apiClient;
