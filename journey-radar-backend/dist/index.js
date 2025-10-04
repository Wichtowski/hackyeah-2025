"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const health_1 = __importDefault(require("./routes/health"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
// CORS configuration (allow common Expo dev origins + configurable env)
const defaultOrigins = ['http://localhost:8081', 'http://localhost:19006'];
const envOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true); // Non-browser or same-origin
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        // In dev, log the blocked origin for easier debugging
        console.warn(`[CORS] Blocked origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
    },
    exposedHeaders: ['x-health-check'],
}));
// Mount API routers
app.use('/api', health_1.default);
app.get('/', (req, res) => {
    res.send('Hello from your new Express app!');
});
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server for 'journey-radar-backend' is running at http://localhost:${port}`);
        console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ') || '(none)'}`);
    });
}
exports.default = app;
