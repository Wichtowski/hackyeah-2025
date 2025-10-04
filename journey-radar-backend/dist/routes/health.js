"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    const ts = new Date().toISOString();
    console.log(`[health] OK ${ts}`);
    res.setHeader('x-health-check', ts);
    res.status(200).json({ message: 'ok from backend' });
});
exports.default = router;
