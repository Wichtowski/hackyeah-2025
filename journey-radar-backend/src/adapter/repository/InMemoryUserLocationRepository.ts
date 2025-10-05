import { UserLocationRepository } from '../../domain/repository/UserLocationRepository';
import { UserLocation } from '../../domain/model/UserLocation';

export class InMemoryUserLocationRepository implements UserLocationRepository {
  private locations: Map<string, UserLocation> = new Map();

  async saveLocation(userLocation: UserLocation): Promise<UserLocation> {
    this.locations.set(userLocation.userId, userLocation);
    console.log(`[UserLocationRepository] Saved location for user ${userLocation.userId}: (${userLocation.latitude}, ${userLocation.longitude})`);
    return userLocation;
  }

  async getLocation(userId: string): Promise<UserLocation | null> {
    return this.locations.get(userId) || null;
  }

  async getAllLocations(): Promise<UserLocation[]> {
    return Array.from(this.locations.values());
  }
}

