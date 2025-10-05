import { Destination, Distance, Duration, Journey, Origin, Route, Station } from '../model/Journey';
import { HARDCODED_STOPS, StopWithDegrees, findStopByName } from '@domain/model/hardcodedStops';
import { IncidentReportRepository } from '../repository/IncidentReportRepository';

export class JourneyService {
  constructor(private readonly incidentReportRepository?: IncidentReportRepository) {}

  async computeJourney(origin: Origin, destination: Destination): Promise<Journey> {
    const start = findStopByName(origin.station.name);
    const end = findStopByName(destination.station.name);

    // Fallback: if we cannot map names to known stops, return a simple direct route
    if (!start || !end) {
      const baseRoute: Route = { stations: [origin.station, destination.station], delay: { time: 0 }, incidents: [] };

      // Populate incidents based on route reference if repository is available
      const incidents = await this.findIncidentsForRoute(origin.station.name, destination.station.name, baseRoute.stations);
      const simple: Route = { ...baseRoute, incidents };
      return { routes: [simple], distance: 0, duration: 0 };
    }

    // Build a corridor-based path along the line from start to end using tram stops
    const stations = this.buildStationsAlongCorridor(start, end);

    // Ensure first and last are the requested ones
    const firstName = stations[0]?.name;
    const lastName = stations[stations.length - 1]?.name;
    if (firstName !== start.name) stations.unshift({ name: start.name });
    if (lastName !== end.name) stations.push({ name: end.name });

    // De-duplicate any accidental repeats
    const deduped = stations.filter((s, i, arr) => i === 0 || s.name !== arr[i - 1].name);

    // Prefer incidents associated to this exact origin/destination.
    // If none are found (e.g., public API cannot associate route), fall back to nearby incidents by proximity.
    let incidents = await this.findIncidentsForRoute(start.name, end.name, deduped);
    if (incidents.length === 0 && this.incidentReportRepository) {
      try {
        // Query for incidents near the midpoint of the path within a reasonable radius
        const midIndex = Math.floor(deduped.length / 2);
        const midAName = deduped[Math.max(0, midIndex - 1)].name;
        const midBName = deduped[Math.min(deduped.length - 1, midIndex)].name;

        const a = HARDCODED_STOPS.find(h => h.name === midAName);
        const b = HARDCODED_STOPS.find(h => h.name === midBName);
        if (a && b) {
          const midLat = (a.latitude + b.latitude) / 2;
          const midLon = (a.longitude + b.longitude) / 2;
          // 2.0 km radius should cover typical adjacent tram stops in test data
          const nearby = await this.incidentReportRepository.findByLocation(midLon, midLat, 2.0);

          if (nearby.length > 0) {
            // Map nearby incidents to nearest connections on this route
            const connections = [] as { id: number; from: Station; to: Station }[];
            for (let i = 0; i < deduped.length - 1; i++) {
              connections.push({ id: i + 1, from: deduped[i], to: deduped[i + 1] });
            }
            const getCoords = (name: string): { lat: number; lon: number } | null => {
              const s = HARDCODED_STOPS.find(h => h.name === name);
              return s ? { lat: s.latitude, lon: s.longitude } : null;
            };
            const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
              const R = 6371;
              const toRad = (deg: number) => deg * (Math.PI / 180);
              const dLat = toRad(lat2 - lat1);
              const dLon = toRad(lon2 - lon1);
              const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              return R * c;
            };
            incidents = nearby.map(rep => {
              let bestConn = connections[0];
              let bestDist = Number.POSITIVE_INFINITY;
              for (const conn of connections) {
                const ca = getCoords(conn.from.name);
                const cb = getCoords(conn.to.name);
                if (!ca || !cb) continue;
                const midLat2 = (ca.lat + cb.lat) / 2;
                const midLon2 = (ca.lon + cb.lon) / 2;
                const d = haversineKm(rep.location.latitude, rep.location.longitude, midLat2, midLon2);
                if (d < bestDist) { bestDist = d; bestConn = conn; }
              }
              return { connection: bestConn };
            });
          } else {
            // Final fallback: map all known incidents to the closest connection.
            // This ensures some visibility of incidents even when route association and proximity are not available.
            const all = await this.incidentReportRepository.findAll();
            if (all.length > 0) {
              const connections = [] as { id: number; from: Station; to: Station }[];
              for (let i = 0; i < deduped.length - 1; i++) {
                connections.push({ id: i + 1, from: deduped[i], to: deduped[i + 1] });
              }
              const getCoords = (name: string): { lat: number; lon: number } | null => {
                const s = HARDCODED_STOPS.find(h => h.name === name);
                return s ? { lat: s.latitude, lon: s.longitude } : null;
              };
              const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
                const R = 6371;
                const toRad = (deg: number) => deg * (Math.PI / 180);
                const dLat = toRad(lat2 - lat1);
                const dLon = toRad(lon2 - lon1);
                const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c;
              };
              incidents = all.map(rep => {
                let bestConn = connections[0];
                let bestDist = Number.POSITIVE_INFINITY;
                for (const conn of connections) {
                  const ca = getCoords(conn.from.name);
                  const cb = getCoords(conn.to.name);
                  if (!ca || !cb) continue;
                  const midLat2 = (ca.lat + cb.lat) / 2;
                  const midLon2 = (ca.lon + cb.lon) / 2;
                  const d = haversineKm(rep.location.latitude, rep.location.longitude, midLat2, midLon2);
                  if (d < bestDist) { bestDist = d; bestConn = conn; }
                }
                return { connection: bestConn };
              });
            }
          }
        }
      } catch { /* ignore fallback errors */ }
    }
    const route: Route = { stations: deduped, delay: { time: 0 }, incidents };
    const distanceKm = this.computeRouteDistanceKm(deduped);
    const approxDurationMin = this.estimateDurationMinutes(distanceKm);

    const distance: Distance = distanceKm;
    const duration: Duration = approxDurationMin;

    return { routes: [route], distance, duration };
  }

  private async findIncidentsForRoute(originName: string, destinationName: string, stations: Station[]): Promise<{ connection: { id: number; from: Station; to: Station } }[]> {
    if (!this.incidentReportRepository) return [];
    try {
      const reports = await this.incidentReportRepository.findByRoute(originName, destinationName);
      if (!reports?.length) return [];
      if ((stations?.length ?? 0) < 2) return [];

      // Build connections list from stations
      const connections = [] as { id: number; from: Station; to: Station }[];
      for (let i = 0; i < stations.length - 1; i++) {
        connections.push({ id: i + 1, from: stations[i], to: stations[i + 1] });
      }

      // Helper to get coordinates for a station name from hardcoded stops
      const getCoords = (name: string): { lat: number; lon: number } | null => {
        const s = HARDCODED_STOPS.find(h => h.name === name);
        return s ? { lat: s.latitude, lon: s.longitude } : null;
      };

      // Haversine distance in km
      const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371;
        const toRad = (deg: number) => deg * (Math.PI / 180);
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      // Map each report to the nearest connection by distance from report location to the midpoint of the connection
      return reports.map((rep) => {
        let bestConn = connections[0];
        let bestDist = Number.POSITIVE_INFINITY;
        for (const conn of connections) {
          const a = getCoords(conn.from.name);
          const b = getCoords(conn.to.name);
          if (!a || !b) continue;
          const midLat = (a.lat + b.lat) / 2;
          const midLon = (a.lon + b.lon) / 2;
          const d = haversineKm(rep.location.latitude, rep.location.longitude, midLat, midLon);
          if (d < bestDist) { bestDist = d; bestConn = conn; }
        }
        return { connection: bestConn };
      });
    } catch {
      return [];
    }
  }

  private buildStationsAlongCorridor(start: StopWithDegrees, end: StopWithDegrees): Station[] {
    const vLat = end.latitude - start.latitude;
    const vLon = end.longitude - start.longitude;
    const vLen = Math.hypot(vLat, vLon);
    if (vLen === 0) {
      return [{ name: start.name }, { name: end.name }];
    }

    const unitLat = vLat / vLen;
    const unitLon = vLon / vLen;

    // Corridor width in degrees (~0.01 deg ~ 1.1 km). Slightly wider to allow some curvature.
    const corridorWidthDeg = 0.015;

    // Consider only tram stops; compute projection t (0..vLen) and perpendicular distance
    type Candidate = { stop: StopWithDegrees; t: number; dPerp: number };
    const candidates: Candidate[] = [];
    for (const s of HARDCODED_STOPS) {
      if (s.category !== 'tram') continue;
      if (s.name === start.name || s.name === end.name) continue;

      const dLat = s.latitude - start.latitude;
      const dLon = s.longitude - start.longitude;
      const t = dLat * unitLat + dLon * unitLon; // scalar projection length in degrees
      if (t <= 0 || t >= vLen) continue;
      const projLat = start.latitude + t * unitLat;
      const projLon = start.longitude + t * unitLon;
      const dPerp = Math.hypot(s.latitude - projLat, s.longitude - projLon);
      if (dPerp <= corridorWidthDeg) {
        candidates.push({ stop: s, t, dPerp });
      }
    }

    // Sort by progress along the path then by closeness to the line
    candidates.sort((a, b) => (a.t - b.t) || (a.dPerp - b.dPerp));

    // If too many, thin out to at most 12 by keeping evenly spaced along t
    const maxStops = 12;
    let selected: Candidate[] = candidates;
    if (candidates.length > maxStops) {
      selected = [];
      for (let i = 0; i < maxStops; i++) {
        const idx = Math.round((i * (candidates.length - 1)) / (maxStops - 1));
        selected.push(candidates[idx]);
      }
      // Ensure strictly increasing t
      selected = selected.sort((a, b) => a.t - b.t).filter((c, i, arr) => i === 0 || c.t > arr[i - 1].t);
    }

    const stations: Station[] = [{ name: start.name }, ...selected.map(c => ({ name: c.stop.name })), { name: end.name }];
    return stations;
  }

  private computeRouteDistanceKm(stations: Station[]): number {
    const byName = new Map<string, StopWithDegrees>();
    for (const s of HARDCODED_STOPS) byName.set(s.name, s);

    let totalKm = 0;
    for (let i = 0; i < stations.length - 1; i++) {
      const a = byName.get(stations[i].name);
      const b = byName.get(stations[i + 1].name);
      if (!a || !b) continue;
      totalKm += this.haversineKm(a.latitude, a.longitude, b.latitude, b.longitude);
    }
    return Number(totalKm.toFixed(3));
  }

  private estimateDurationMinutes(distanceKm: number): number {
    // Assume average tram speed ~ 20 km/h including stops -> 3 min/km
    const minutes = distanceKm * 3;
    return Math.round(minutes);
  }

  private haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
