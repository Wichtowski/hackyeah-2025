"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableApiDebug = enableApiDebug;
exports.configureApi = configureApi;
exports.getClient = getClient;
exports.isDebugEnabled = isDebugEnabled;
const axios_1 = __importDefault(require("axios"));
/** Internal mutable state for the SDK HTTP layer */
let API_BASE_URL = 'http://localhost:3000/api';
let debugEnabled = false;
let interceptorsApplied = false;
let client = createAxiosInstance();
function createAxiosInstance() {
    return axios_1.default.create({
        baseURL: API_BASE_URL,
        timeout: 5000,
    });
}
function applyInterceptors() {
    if (interceptorsApplied)
        return;
    client.interceptors.request.use((config) => {
        var _a;
        if (debugEnabled) {
            // eslint-disable-next-line no-console
            console.log(`[SDK][request] ${(_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()} ${config.baseURL}${config.url}`);
        }
        return config;
    });
    client.interceptors.response.use((res) => {
        if (debugEnabled) {
            // eslint-disable-next-line no-console
            console.log(`[SDK][response] ${res.status} ${res.config.url}`, res.data);
        }
        return res;
    }, (error) => {
        var _a;
        if (debugEnabled) {
            // eslint-disable-next-line no-console
            console.log('[SDK][error]', (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status, error === null || error === void 0 ? void 0 : error.message);
        }
        return Promise.reject(error);
    });
    interceptorsApplied = true;
}
/** Enable or disable verbose API logging (idempotent). */
function enableApiDebug(enable = true) {
    debugEnabled = enable;
    applyInterceptors();
}
/** Reconfigure the underlying Axios client base URL (e.g. when using a device or tunnel). */
function configureApi(options) {
    API_BASE_URL = options.baseURL;
    client = createAxiosInstance();
    // Reset interceptors so they can be re-applied on demand
    interceptorsApplied = false;
    if (debugEnabled)
        applyInterceptors();
}
/** Get the shared Axios instance (ensures interceptors are applied when debug is enabled). */
function getClient() {
    // If debug was enabled after a reconfigure ensure interceptors are applied.
    if (debugEnabled && !interceptorsApplied)
        applyInterceptors();
    return client;
}
function isDebugEnabled() {
    return debugEnabled;
}
