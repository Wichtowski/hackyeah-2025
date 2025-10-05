"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyProgressService = void 0;
class JourneyProgressService {
    computeProgress(journey, _coordinates) {
        const firstRoute = journey.routes[0];
        const lastRoute = journey.routes[journey.routes.length - 1];
        const progress = {
            currentRoute: 0,
            currentStage: 0,
            currentConnection: { id: 1, from: firstRoute.stations[0], to: firstRoute.stations[1] }
        };
        const firstStation = firstRoute.stations[0];
        const lastStation = lastRoute.stations[lastRoute.stations.length - 1];
        const aggregatedDelayTime = journey.routes.reduce((acc, r) => acc + r.delay.time, 0);
        return {
            routes: journey.routes,
            progress,
            delay: { time: aggregatedDelayTime },
            firstStation,
            lastStation
        };
    }
}
exports.JourneyProgressService = JourneyProgressService;
