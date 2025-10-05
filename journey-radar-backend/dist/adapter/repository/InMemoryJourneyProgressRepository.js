"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryJourneyProgressRepository = void 0;
class InMemoryJourneyProgressRepository {
    journeyIdToProgresses = new Map();
    async save(progress) {
        const list = this.journeyIdToProgresses.get(progress.journeyId) ?? [];
        list.push(progress);
        this.journeyIdToProgresses.set(progress.journeyId, list);
    }
    async findByJourneyId(journeyId) {
        const list = this.journeyIdToProgresses.get(journeyId);
        if (!list || list.length === 0)
            return undefined;
        return list[list.length - 1];
    }
    async findAll() {
        const all = [];
        for (const list of this.journeyIdToProgresses.values()) {
            all.push(...list);
        }
        return all;
    }
}
exports.InMemoryJourneyProgressRepository = InMemoryJourneyProgressRepository;
