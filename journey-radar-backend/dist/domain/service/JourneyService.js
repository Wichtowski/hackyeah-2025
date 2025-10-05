"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyService = void 0;
class JourneyService {
    computeJourney(origin, destination) {
        const routes = [
            { stations: [origin.station, { name: 'Mid' }], delay: { time: 0 }, incidents: [] },
            { stations: [{ name: 'Mid' }, destination.station], delay: { time: 0 }, incidents: [] }
        ];
        const distance = 0;
        const duration = 0;
        return { routes, distance, duration };
    }
}
exports.JourneyService = JourneyService;
