"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJourneysRoutes = createJourneysRoutes;
const express_1 = require("express");
function createJourneysRoutes(facade) {
    const router = (0, express_1.Router)();
    // GET /journeys?origin=&destination=
    router.get('/journeys', async (req, res) => {
        try {
            const origin = req.query.origin?.toString();
            const destination = req.query.destination?.toString();
            if (!origin || !destination || origin.trim().length === 0 || destination.trim().length === 0) {
                return res.status(400).json({ error: 'Both origin and destination query parameters are required and must be non-empty' });
            }
            const journey = await facade.getJourney({ station: { name: origin } }, { station: { name: destination } });
            return res.status(200).json(journey);
        }
        catch (error) {
            console.error('Error in GET /journeys:', error);
            return res.status(500).json({ error: 'Failed to get journey' });
        }
    });
    // POST /journeys/start
    router.post('/journeys/start', async (req, res) => {
        try {
            const body = req.body;
            if (!body || typeof body !== 'object' || !Array.isArray(body.routes) || typeof body.distance !== 'number' || typeof body.duration !== 'number') {
                return res.status(400).json({ error: 'Valid Journey body is required' });
            }
            const response = await facade.startJourney(body);
            return res.status(201).json(response);
        }
        catch (error) {
            console.error('Error in POST /journeys/start:', error);
            return res.status(500).json({ error: 'Failed to start journey' });
        }
    });
    // GET /journeys/:journeyId/progress?longitude=&latitude=
    router.get('/journeys/:journeyId/progress', async (req, res) => {
        try {
            const { journeyId } = req.params;
            const { longitude, latitude } = req.query;
            if (longitude == null || latitude == null) {
                return res.status(400).json({ error: 'Both longitude and latitude are required' });
            }
            const lon = Number(longitude);
            const lat = Number(latitude);
            if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
                return res.status(400).json({ error: 'Longitude and latitude must be valid numbers' });
            }
            const progress = await facade.getJourneyProgress(journeyId, { longitude: lon, latitude: lat });
            return res.status(200).json(progress);
        }
        catch (error) {
            console.error('Error in GET /journeys/:journeyId/progress:', error);
            return res.status(500).json({ error: 'Failed to get journey progress' });
        }
    });
    return router;
}
