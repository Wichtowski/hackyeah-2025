"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocationMockRoutes = createLocationMockRoutes;
const express_1 = require("express");
function createLocationMockRoutes(facade) {
    const router = (0, express_1.Router)();
    // POST /mock/location - Mock a user's location for testing/demo purposes
    router.post('/mock/location', async (req, res) => {
        try {
            const { userId, longitude, latitude } = req.body;
            // Validation
            if (!userId || typeof userId !== 'string') {
                return res.status(400).json({ error: 'Valid userId is required' });
            }
            if (typeof longitude !== 'number' || typeof latitude !== 'number') {
                return res.status(400).json({ error: 'Valid longitude and latitude are required (must be numbers)' });
            }
            if (longitude < -180 || longitude > 180) {
                return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
            }
            if (latitude < -90 || latitude > 90) {
                return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
            }
            const result = await facade.mockUserLocation(userId, longitude, latitude);
            res.status(200).json({
                message: 'User location mocked successfully',
                ...result
            });
        }
        catch (error) {
            console.error('Error mocking user location:', error);
            res.status(500).json({ error: 'Failed to mock user location' });
        }
    });
    return router;
}
