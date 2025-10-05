import { Coordinates, Journey, JourneyProgress, Progress } from '../model/Journey';

export class JourneyProgressService {
  computeProgress(journey: Journey, _coordinates: Coordinates, journeyId: string): JourneyProgress {
    const firstRoute = journey.routes[0];
    const lastRoute = journey.routes[journey.routes.length - 1];

    const progress: Progress = {
      currentRoute: 0,
      currentStage: 0,
      currentConnection: { id: 1, from: firstRoute.stations[0], to: firstRoute.stations[1] }
    };

    const firstStation = firstRoute.stations[0];
    const lastStation = lastRoute.stations[lastRoute.stations.length - 1];

    const aggregatedDelayTime = journey.routes.reduce((acc, r) => acc + r.delay.time, 0);

    return {
      journeyId,
      routes: journey.routes,
      progress,
      delay: { time: aggregatedDelayTime },
      firstStation,
      lastStation
    };
  }
}
