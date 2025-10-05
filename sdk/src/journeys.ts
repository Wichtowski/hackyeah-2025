import { apiGet, apiPost } from './httpClient';
import { Coordinates, Destination, Journey, JourneyProgress, JourneyStartResponse, Origin } from './types';

export async function getJourney(origin: Origin, destination: Destination): Promise<Journey> {
  const params = new URLSearchParams({
    origin: origin.station.name,
    destination: destination.station.name,
  });
  return apiGet<Journey>(`/journeys?${params.toString()}`);
}

export async function startJourney(journey: Journey): Promise<JourneyStartResponse> {
  return apiPost<JourneyStartResponse, Journey>('/journeys/start', journey);
}

export async function getJourneyStage(journeyId: string, coordinates: Coordinates): Promise<JourneyProgress> {
  const params = new URLSearchParams({
    longitude: String(coordinates.longitude),
    latitude: String(coordinates.latitude),
  });
  return apiGet<JourneyProgress>(`/journeys/${encodeURIComponent(journeyId)}/progress?${params.toString()}`);
}
