"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyService = void 0;
const hardcodedStops_1 = require("../model/hardcodedStops");
class JourneyService {
    computeJourney(origin, destination) {
        const start = (0, hardcodedStops_1.findStopByName)(origin.station.name);
        const end = (0, hardcodedStops_1.findStopByName)(destination.station.name);
        // Fallback: if we cannot map names to known stops, return a simple direct route
        if (!start || !end) {
            const simple = { stations: [origin.station, destination.station], delay: { time: 0 }, incidents: [] };
            return { routes: [simple], distance: 0, duration: 0 };
        }
        // Build a corridor-based path along the line from start to end using tram stops
        const stations = this.buildStationsAlongCorridor(start, end);
        // Ensure first and last are the requested ones
        const firstName = stations[0]?.name;
        const lastName = stations[stations.length - 1]?.name;
        if (firstName !== start.name)
            stations.unshift({ name: start.name });
        if (lastName !== end.name)
            stations.push({ name: end.name });
        // De-duplicate any accidental repeats
        const deduped = stations.filter((s, i, arr) => i === 0 || s.name !== arr[i - 1].name);
        const route = { stations: deduped, delay: { time: 0 }, incidents: [] };
        const distanceKm = this.computeRouteDistanceKm(deduped);
        const approxDurationMin = this.estimateDurationMinutes(distanceKm);
        const distance = distanceKm;
        const duration = approxDurationMin;
        return { routes: [route], distance, duration };
    }
    buildStationsAlongCorridor(start, end) {
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
        const candidates = [];
        for (const s of hardcodedStops_1.HARDCODED_STOPS) {
            if (s.category !== 'tram')
                continue;
            if (s.name === start.name || s.name === end.name)
                continue;
            const dLat = s.latitude - start.latitude;
            const dLon = s.longitude - start.longitude;
            const t = dLat * unitLat + dLon * unitLon; // scalar projection length in degrees
            if (t <= 0 || t >= vLen)
                continue;
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
        let selected = candidates;
        if (candidates.length > maxStops) {
            selected = [];
            for (let i = 0; i < maxStops; i++) {
                const idx = Math.round((i * (candidates.length - 1)) / (maxStops - 1));
                selected.push(candidates[idx]);
            }
            // Ensure strictly increasing t
            selected = selected.sort((a, b) => a.t - b.t).filter((c, i, arr) => i === 0 || c.t > arr[i - 1].t);
        }
        const stations = [{ name: start.name }, ...selected.map(c => ({ name: c.stop.name })), { name: end.name }];
        return stations;
    }
    computeRouteDistanceKm(stations) {
        const byName = new Map();
        for (const s of hardcodedStops_1.HARDCODED_STOPS)
            byName.set(s.name, s);
        let totalKm = 0;
        for (let i = 0; i < stations.length - 1; i++) {
            const a = byName.get(stations[i].name);
            const b = byName.get(stations[i + 1].name);
            if (!a || !b)
                continue;
            totalKm += this.haversineKm(a.latitude, a.longitude, b.latitude, b.longitude);
        }
        return Number(totalKm.toFixed(3));
    }
    estimateDurationMinutes(distanceKm) {
        // Assume average tram speed ~ 20 km/h including stops -> 3 min/km
        const minutes = distanceKm * 3;
        return Math.round(minutes);
    }
    haversineKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
}
exports.JourneyService = JourneyService;
