"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApi = exports.enableApiDebug = exports.apiClient = void 0;
const httpClient_1 = require("./httpClient");
Object.defineProperty(exports, "enableApiDebug", { enumerable: true, get: function () { return httpClient_1.enableApiDebug; } });
Object.defineProperty(exports, "configureApi", { enumerable: true, get: function () { return httpClient_1.configureApi; } });
const health_1 = require("./health");
// Public API client object (backwards compatible with previous shape)
exports.apiClient = {
    healthCheck: health_1.healthCheck,
};
exports.default = exports.apiClient;
