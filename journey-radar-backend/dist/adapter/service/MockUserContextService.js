"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockUserContextService = void 0;
const IncidentReport_1 = require("../../domain/model/IncidentReport");
/**
 * Mock implementation of UserContextService for testing and development
 * In production, this would integrate with actual tracking and journey management systems
 */
class MockUserContextService {
    userLocationRepository;
    userJourneys = new Map();
    constructor(userLocationRepository) {
        this.userLocationRepository = userLocationRepository;
    }
    async getCurrentLocation(userId) {
        // Check repository for user location
        const userLocation = await this.userLocationRepository.getLocation(userId);
        if (userLocation) {
            return {
                longitude: userLocation.longitude,
                latitude: userLocation.latitude
            };
        }
        // Default location (Warsaw Central Station)
        return { longitude: 21.0122, latitude: 52.2297 };
    }
    async getReporter(userId) {
        // For now, all users are regular USER type reporters
        return {
            id: userId,
            type: IncidentReport_1.ReporterType.USER
        };
    }
    async getActiveJourney(userId) {
        // Check if user has an active journey
        if (this.userJourneys.has(userId)) {
            return this.userJourneys.get(userId) || null;
        }
        // Return null if no active journey
        return null;
    }
    // Helper methods for testing - simulate user state
    setUserLocation(userId, location) {
        // This is now deprecated in favor of using the repository directly
        // Kept for backward compatibility with existing tests
        this.userLocationRepository.saveLocation({
            userId,
            longitude: location.longitude,
            latitude: location.latitude,
            timestamp: new Date()
        });
    }
    setUserJourney(userId, journey) {
        this.userJourneys.set(userId, journey);
    }
    clearUserData(userId) {
        // Note: This won't clear the repository data, only journey data
        this.userJourneys.delete(userId);
    }
}
exports.MockUserContextService = MockUserContextService;
