import { JourneyProgress } from '@domain/model/Journey';
import { JourneyProgressRepository } from '@domain/repository/JourneyProgressRepository';

export class InMemoryJourneyProgressRepository implements JourneyProgressRepository {
  private readonly journeyIdToProgresses: Map<string, JourneyProgress[]> = new Map();

  async save(progress: JourneyProgress): Promise<void> {
    const list = this.journeyIdToProgresses.get(progress.journeyId) ?? [];
    list.push(progress);
    this.journeyIdToProgresses.set(progress.journeyId, list);
  }

  async findByJourneyId(journeyId: string): Promise<JourneyProgress | undefined> {
    const list = this.journeyIdToProgresses.get(journeyId);
    if (!list || list.length === 0) return undefined;
    return list[list.length - 1];
  }

  async findAll(): Promise<JourneyProgress[]> {
    const all: JourneyProgress[] = [];
    for (const list of this.journeyIdToProgresses.values()) {
      all.push(...list);
    }
    return all;
  }
}


