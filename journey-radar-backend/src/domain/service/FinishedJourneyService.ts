import { FinishedJourney } from '@domain/model/FinishedJourney';
import { FinishedJourneyRepository } from '@domain/repository/FinishedJourneyRepository';
import { JourneyProgress } from '@domain/model/Journey';

export class FinishedJourneyService {
  constructor(private readonly repo?: FinishedJourneyRepository) {}

  async persistIfFinished(progress: JourneyProgress, journeyId: string, startedAt: string, userId?: string): Promise<boolean> {
    if (!this.repo) return false;
    const isAtFinalConnection = progress.progress.currentConnection.to.name === progress.lastStation.name;
    if (!isAtFinalConnection) return false;

    if (!userId) return false;

    const finished: FinishedJourney = {
      userId,
      journeyId,
      from: progress.firstStation,
      to: progress.lastStation,
      startedAt: startedAt || new Date().toISOString(),
      finishedAt: new Date().toISOString(),
    };
    await this.repo.save(finished);
    return true;
  }

  async findByUserId(userId: string): Promise<FinishedJourney[]> {
    if (!this.repo) return [];
    return this.repo.findByUserId(userId);
  }
}


