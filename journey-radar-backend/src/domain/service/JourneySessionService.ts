import { Journey, JourneyStartResponse } from '@domain/model/Journey';

export class JourneySessionService {
  private readonly sessions: Map<string, Journey> = new Map();
  private readonly journeyIdToStartedAt: Map<string, string> = new Map();
  private readonly journeyIdToUserId: Map<string, string> = new Map();

  startJourney(journey: Journey): JourneyStartResponse {
    const journeyId = `journey-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const startedAt = new Date().toISOString();
    this.sessions.set(journeyId, journey);
    this.journeyIdToStartedAt.set(journeyId, startedAt);
    const state = { route_index: 0, position_in_route: 0, updated_at: startedAt };
    return { journey_id: journeyId, state };
  }

  getJourney(journeyId: string): Journey | undefined {
    return this.sessions.get(journeyId);
  }

  setJourney(journeyId: string, journey: Journey): void {
    this.sessions.set(journeyId, journey);
  }

  getAllSessions(): Array<{ journeyId: string; journey: Journey }> {
    return Array.from(this.sessions.entries()).map(([journeyId, journey]) => ({ journeyId, journey }));
  }

  associateUser(journeyId: string, userId: string): void {
    this.journeyIdToUserId.set(journeyId, userId);
  }

  getAssociatedUser(journeyId: string): string | undefined {
    return this.journeyIdToUserId.get(journeyId);
  }

  getStartedAt(journeyId: string): string | undefined {
    return this.journeyIdToStartedAt.get(journeyId);
  }

  cleanup(journeyId: string): void {
    this.sessions.delete(journeyId);
    this.journeyIdToUserId.delete(journeyId);
    this.journeyIdToStartedAt.delete(journeyId);
  }
}


