import { Destination, Distance, Duration, Journey, Origin, Route } from '../model/Journey';

export class JourneyService {
  computeJourney(origin: Origin, destination: Destination): Journey {
    const routes: Route[] = [
      { stations: [origin.station, { name: 'Mid' }], delay: { time: 0 }, incidents: [] },
      { stations: [{ name: 'Mid' }, destination.station], delay: { time: 0 }, incidents: [] }
    ];

    const distance: Distance = 0;
    const duration: Duration = 0;

    return { routes, distance, duration };
  }
}
