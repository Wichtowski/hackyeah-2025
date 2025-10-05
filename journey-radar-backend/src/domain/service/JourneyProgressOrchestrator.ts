import { Coordinates, Journey, JourneyProgress } from '@domain/model/Journey';
import { JourneyService } from './JourneyService';
import { JourneyProgressService } from './JourneyProgressService';
import { JourneySessionService } from './JourneySessionService';
import { FinishedJourneyService } from './FinishedJourneyService';

export class JourneyProgressOrchestrator {
  constructor(
    private readonly journeyService: JourneyService,
    private readonly journeyProgressService: JourneyProgressService,
    private readonly journeySessionService: JourneySessionService,
    private readonly finishedJourneyService: FinishedJourneyService,
  ) {}

  async computeAndPersist(journeyId: string, coordinates: Coordinates, userId?: string): Promise<JourneyProgress> {
    const journey: Journey | undefined = this.journeySessionService.getJourney(journeyId);
    const effectiveJourney = journey ?? await this.journeyService.computeJourney({ station: { name: 'Unknown' } }, { station: { name: 'Unknown' } });

    const progress = await this.journeyProgressService.computeProgress(effectiveJourney, coordinates, journeyId);

    try {
      if (userId) this.journeySessionService.associateUser(journeyId, userId);
      const associated = this.journeySessionService.getAssociatedUser(journeyId);
      const startedAt = this.journeySessionService.getStartedAt(journeyId) || new Date().toISOString();
      const persisted = await this.finishedJourneyService.persistIfFinished(progress, journeyId, startedAt, associated);
      if (persisted) this.journeySessionService.cleanup(journeyId);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('History persistence failed:', e);
    }

    return progress;
  }
}


