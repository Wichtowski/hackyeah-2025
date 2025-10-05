import { JourneyService } from '../../src/domain/service/JourneyService';
import { InMemoryIncidentReportRepository } from '../../src/adapter/repository/InMemoryIncidentReportRepository';
import { IncidentReport, IncidentReportDetails, IncidentType, ReporterType } from '../../src/domain/model/IncidentReport';
import { HARDCODED_STOPS } from '../../src/domain/model/hardcodedStops';

describe('JourneyService incidents population', () => {
  it('populates incidents on computed journey using IncidentReportRepository.findByRoute', async () => {
    const repo = new InMemoryIncidentReportRepository();

    const originName = 'Rondo Matecznego';
    const destinationName = 'Wawel';

    // Seed a couple of incident reports associated to this route
    const details: IncidentReportDetails = { reportedOnRoute: { origin: originName, destination: destinationName, transportVehicleId: 'tram_1' } };
    await repo.save(new IncidentReport('', { longitude: 19.94, latitude: 50.06 }, { id: 'u1', type: ReporterType.USER }, IncidentType.DELAY, details, new Date(), 'Delay on route'));
    await repo.save(new IncidentReport('', { longitude: 19.94, latitude: 50.06 }, { id: 'u2', type: ReporterType.USER }, IncidentType.ISSUES, details, new Date(), 'Issues near stop'));

    const service = new JourneyService(repo);

    const journey = await service.computeJourney({ station: { name: originName } }, { station: { name: destinationName } });

    expect(journey.routes.length).toBeGreaterThan(0);
    const route = journey.routes[0];
    expect(Array.isArray(route.incidents)).toBe(true);
    expect(route.incidents.length).toBeGreaterThanOrEqual(2);

    // Each incident should reference a connection with from/to within the route
    const stationNames = new Set(route.stations.map(s => s.name));
    for (const inc of route.incidents) {
      expect(stationNames.has(inc.connection.from.name)).toBe(true);
      expect(stationNames.has(inc.connection.to.name)).toBe(true);
    }
  });

  it('maps incident to nearest connection by location midpoint', async () => {
    const repo = new InMemoryIncidentReportRepository();
    const originName = 'Rondo Matecznego';
    const destinationName = 'Wawel';

    const service = new JourneyService(repo);
    const journey = await service.computeJourney({ station: { name: originName } }, { station: { name: destinationName } });
    const route = journey.routes[0];

    // Build connections list from stations
    const connections = [] as { id: number; from: string; to: string }[];
    for (let i = 0; i < route.stations.length - 1; i++) {
      connections.push({ id: i + 1, from: route.stations[i].name, to: route.stations[i + 1].name });
    }

    // Choose a middle connection (if exists) and place incident near its midpoint
    const middleIndex = Math.floor(connections.length / 2);
    const targetConn = connections[Math.max(0, Math.min(connections.length - 1, middleIndex))];

    const a = HARDCODED_STOPS.find(h => h.name === targetConn.from)!;
    const b = HARDCODED_STOPS.find(h => h.name === targetConn.to)!;
    const midLat = (a.latitude + b.latitude) / 2;
    const midLon = (a.longitude + b.longitude) / 2;

    const details: IncidentReportDetails = { reportedOnRoute: { origin: originName, destination: destinationName, transportVehicleId: 'tram_2' } };
    await repo.save(new IncidentReport('', { longitude: midLon, latitude: midLat }, { id: 'u3', type: ReporterType.USER }, IncidentType.DELAY, details, new Date(), 'Near middle connection'));

    const journeyWithIncident = await service.computeJourney({ station: { name: originName } }, { station: { name: destinationName } });
    const route2 = journeyWithIncident.routes[0];

    // Find at least one incident mapped to the target connection
    const match = route2.incidents.some(inc => inc.connection.from.name === targetConn.from && inc.connection.to.name === targetConn.to);
    expect(match).toBe(true);
  });
});


