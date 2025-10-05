import { FinishedJourney } from '@domain/model/FinishedJourney';

export interface FinishedJourneyRepository {
  save(journey: FinishedJourney): Promise<void>;
  findByUserId(userId: string): Promise<FinishedJourney[]>;
}


