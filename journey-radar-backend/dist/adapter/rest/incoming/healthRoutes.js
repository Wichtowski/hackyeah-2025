"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHealthRoutes = void 0;
const express_1 = require("express");
const createHealthRoutes = (facade) => {
    const router = (0, express_1.Router)();
    router.get('/health', async (req, res) => {
        try {
            const healthStatus = await facade.checkHealth();
            res.status(200).json(healthStatus);
        }
        catch (error) {
            res.status(500).json({ status: 'ERROR', message: 'Internal Server Error' });
        }
    });
    return router;
};
exports.createHealthRoutes = createHealthRoutes;
