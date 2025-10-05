"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneySessionService = void 0;
class JourneySessionService {
    sessions = new Map();
    journeyIdToStartedAt = new Map();
    journeyIdToUserId = new Map();
    startJourney(journey) {
        const journeyId = `journey-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const startedAt = new Date().toISOString();
        this.sessions.set(journeyId, journey);
        this.journeyIdToStartedAt.set(journeyId, startedAt);
        const state = { route_index: 0, position_in_route: 0, updated_at: startedAt };
        return { journey_id: journeyId, state };
    }
    getJourney(journeyId) {
        return this.sessions.get(journeyId);
    }
    setJourney(journeyId, journey) {
        this.sessions.set(journeyId, journey);
    }
    getAllSessions() {
        return Array.from(this.sessions.entries()).map(([journeyId, journey]) => ({ journeyId, journey }));
    }
    associateUser(journeyId, userId) {
        this.journeyIdToUserId.set(journeyId, userId);
    }
    getAssociatedUser(journeyId) {
        return this.journeyIdToUserId.get(journeyId);
    }
    getStartedAt(journeyId) {
        return this.journeyIdToStartedAt.get(journeyId);
    }
    cleanup(journeyId) {
        this.sessions.delete(journeyId);
        this.journeyIdToUserId.delete(journeyId);
        this.journeyIdToStartedAt.delete(journeyId);
    }
}
exports.JourneySessionService = JourneySessionService;
