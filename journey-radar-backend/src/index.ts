import express, { Request, Response } from 'express';
import healthRouter from './routes/health';
import cors from 'cors';

const app = express();
const port = 3000;

// CORS configuration (allow common Expo dev origins + configurable env)
const defaultOrigins = ['http://localhost:8081', 'http://localhost:19006'];
const envOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Non-browser or same-origin
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // In dev, log the blocked origin for easier debugging
    console.warn(`[CORS] Blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  exposedHeaders: ['x-health-check'],
}));

// Mount API routers
app.use('/api', healthRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from your new Express app!');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server for 'journey-radar-backend' is running at http://localhost:${port}`);
    console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ') || '(none)'}`);
  });
}

export default app;