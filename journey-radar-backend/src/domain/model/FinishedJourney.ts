export interface FinishedJourney {
  userId: string;
  journeyId: string;
  from: { name: string };
  to: { name: string };
  startedAt: string; // ISO timestamp
  finishedAt: string; // ISO timestamp
}


