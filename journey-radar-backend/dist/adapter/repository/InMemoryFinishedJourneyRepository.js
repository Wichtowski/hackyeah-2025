"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryFinishedJourneyRepository = void 0;
class InMemoryFinishedJourneyRepository {
    userIdToJourneys = new Map();
    async save(journey) {
        const list = this.userIdToJourneys.get(journey.userId) ?? [];
        list.push(journey);
        this.userIdToJourneys.set(journey.userId, list);
    }
    async findByUserId(userId) {
        return [...(this.userIdToJourneys.get(userId) ?? [])];
    }
}
exports.InMemoryFinishedJourneyRepository = InMemoryFinishedJourneyRepository;
