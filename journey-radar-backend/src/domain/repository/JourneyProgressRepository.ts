import { JourneyProgress } from '@domain/model/Journey';

export interface JourneyProgressRepository {
  save(progress: JourneyProgress): Promise<void>;
  findByJourneyId(journeyId: string): Promise<JourneyProgress | undefined>;
  findAll(): Promise<JourneyProgress[]>;
}


