"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryUserLocationRepository = void 0;
class InMemoryUserLocationRepository {
    locations = new Map();
    async saveLocation(userLocation) {
        this.locations.set(userLocation.userId, userLocation);
        console.log(`[UserLocationRepository] Saved location for user ${userLocation.userId}: (${userLocation.latitude}, ${userLocation.longitude})`);
        return userLocation;
    }
    async getLocation(userId) {
        return this.locations.get(userId) || null;
    }
    async getAllLocations() {
        return Array.from(this.locations.values());
    }
}
exports.InMemoryUserLocationRepository = InMemoryUserLocationRepository;
