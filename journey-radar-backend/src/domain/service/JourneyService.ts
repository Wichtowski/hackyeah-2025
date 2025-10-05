import { Destination, Distance, Duration, Journey, Origin, Route, Station } from '../model/Journey';
import { HARDCODED_STOPS, StopWithDegrees, findStopByName } from '@domain/model/hardcodedStops';

export class JourneyService {
  computeJourney(origin: Origin, destination: Destination): Journey {
    const start = findStopByName(origin.station.name);
    const end = findStopByName(destination.station.name);

    // Fallback: if we cannot map names to known stops, return a simple direct route
    if (!start || !end) {
      const simple: Route = { stations: [origin.station, destination.station], delay: { time: 0 }, incidents: [] };
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

    const route: Route = { stations: deduped, delay: { time: 0 }, incidents: [] };
    const distanceKm = this.computeRouteDistanceKm(deduped);
    const approxDurationMin = this.estimateDurationMinutes(distanceKm);

    const distance: Distance = distanceKm;
    const duration: Duration = approxDurationMin;

    return { routes: [route], distance, duration };
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
