"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinishedJourneyService = void 0;
class FinishedJourneyService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async persistIfFinished(progress, journeyId, startedAt, userId) {
        if (!this.repo)
            return false;
        const isAtFinalConnection = progress.progress.currentConnection.to.name === progress.lastStation.name;
        if (!isAtFinalConnection)
            return false;
        if (!userId)
            return false;
        const finished = {
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
    async findByUserId(userId) {
        if (!this.repo)
            return [];
        return this.repo.findByUserId(userId);
    }
}
exports.FinishedJourneyService = FinishedJourneyService;
