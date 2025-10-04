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
exports.enableApiDebug = enableApiDebug;
exports.configureApi = configureApi;
exports.getClient = getClient;
exports.isDebugEnabled = isDebugEnabled;
exports.apiGet = apiGet;
exports.apiPost = apiPost;
exports.apiPut = apiPut;
exports.apiPatch = apiPatch;
exports.apiDelete = apiDelete;
exports.normalizeApiError = normalizeApiError;
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
function toApiError(error) {
    var _a, _b, _c, _d;
    if (error === null || error === void 0 ? void 0 : error.isAxiosError) {
        return {
            status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
            message: ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message || 'Request failed',
            details: (_d = error.response) === null || _d === void 0 ? void 0 : _d.data,
            raw: error,
        };
    }
    return { message: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error', raw: error };
}
function unwrap(promise) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield promise;
            return res.data;
        }
        catch (err) {
            throw toApiError(err);
        }
    });
}
/** Perform a typed GET request returning body as T */
function apiGet(url, config) {
    return unwrap(getClient().get(url, config));
}
/** Perform a typed POST request returning body as R (response) with data payload D */
function apiPost(url, data, config) {
    return unwrap(getClient().post(url, data, config));
}
/** Perform a typed PUT request */
function apiPut(url, data, config) {
    return unwrap(getClient().put(url, data, config));
}
/** Perform a typed PATCH request */
function apiPatch(url, data, config) {
    return unwrap(getClient().patch(url, data, config));
}
/** Perform a typed DELETE request */
function apiDelete(url, config) {
    return unwrap(getClient().delete(url, config));
}
/** Expose a helper for direct error normalization if consumers catch raw errors */
function normalizeApiError(error) {
    return toApiError(error);
}
