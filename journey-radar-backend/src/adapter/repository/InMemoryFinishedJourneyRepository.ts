import { FinishedJourney } from '@domain/model/FinishedJourney';
import { FinishedJourneyRepository } from '@domain/repository/FinishedJourneyRepository';

export class InMemoryFinishedJourneyRepository implements FinishedJourneyRepository {
  private readonly userIdToJourneys: Map<string, FinishedJourney[]> = new Map();

  async save(journey: FinishedJourney): Promise<void> {
    const list = this.userIdToJourneys.get(journey.userId) ?? [];
    list.push(journey);
    this.userIdToJourneys.set(journey.userId, list);
  }

  async findByUserId(userId: string): Promise<FinishedJourney[]> {
    return [...(this.userIdToJourneys.get(userId) ?? [])];
  }
}


