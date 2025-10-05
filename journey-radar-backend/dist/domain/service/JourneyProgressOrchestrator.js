"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyProgressOrchestrator = void 0;
class JourneyProgressOrchestrator {
    journeyService;
    journeyProgressService;
    journeySessionService;
    finishedJourneyService;
    constructor(journeyService, journeyProgressService, journeySessionService, finishedJourneyService) {
        this.journeyService = journeyService;
        this.journeyProgressService = journeyProgressService;
        this.journeySessionService = journeySessionService;
        this.finishedJourneyService = finishedJourneyService;
    }
    async computeAndPersist(journeyId, coordinates, userId) {
        const journey = this.journeySessionService.getJourney(journeyId);
        const effectiveJourney = journey ?? this.journeyService.computeJourney({ station: { name: 'Unknown' } }, { station: { name: 'Unknown' } });
        const progress = await this.journeyProgressService.computeProgress(effectiveJourney, coordinates, journeyId);
        try {
            if (userId)
                this.journeySessionService.associateUser(journeyId, userId);
            const associated = this.journeySessionService.getAssociatedUser(journeyId);
            const startedAt = this.journeySessionService.getStartedAt(journeyId) || new Date().toISOString();
            const persisted = await this.finishedJourneyService.persistIfFinished(progress, journeyId, startedAt, associated);
            if (persisted)
                this.journeySessionService.cleanup(journeyId);
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.warn('History persistence failed:', e);
        }
        return progress;
    }
}
exports.JourneyProgressOrchestrator = JourneyProgressOrchestrator;
