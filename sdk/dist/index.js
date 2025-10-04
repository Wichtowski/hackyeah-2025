"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = exports.configureApi = exports.enableApiDebug = void 0;
const axios_1 = __importDefault(require("axios"));
let API_BASE_URL = 'http://localhost:3000/api';
let debugEnabled = false;
let interceptorsApplied = false;
let client = axios_1.default.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
});
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
/** Enable or disable verbose API logging */
const enableApiDebug = (enable = true) => {
    debugEnabled = enable;
    applyInterceptors();
};
exports.enableApiDebug = enableApiDebug;
/**
 * Reconfigure the underlying Axios client base URL (e.g. when using a device or tunnel).
 */
const configureApi = (options) => {
    API_BASE_URL = options.baseURL;
    client = axios_1.default.create({
        baseURL: API_BASE_URL,
        timeout: 5000,
    });
    // Always reset interceptors so they can be re-applied for the new client
    interceptorsApplied = false;
    if (debugEnabled) {
        applyInterceptors();
    }
};
exports.configureApi = configureApi;
exports.apiClient = {
    /** Perform a simple backend health check */
    healthCheck: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield client.get('/health');
            const headerTs = response.headers['x-health-check'];
            return Object.assign(Object.assign({}, response.data), { headerTimestamp: headerTs });
        }
        catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }),
};
exports.default = exports.apiClient;
