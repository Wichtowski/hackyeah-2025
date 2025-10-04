import { UserContextService } from '../../domain/service/UserContextService';
import { Location, Reporter, ReporterType, RouteReference } from '../../domain/model/IncidentReport';

/**
 * Mock implementation of UserContextService for testing and development
 * In production, this would integrate with actual tracking and journey management systems
 */
export class MockUserContextService implements UserContextService {
  // Simulated user data store
  private userLocations: Map<string, Location> = new Map();
  private userJourneys: Map<string, RouteReference | null> = new Map();

  async getCurrentLocation(userId: string): Promise<Location> {
    // Check if we have a location for this user, otherwise return a default
    const location = this.userLocations.get(userId);
    if (location) {
      return location;
    }

    // Default location (Warsaw Central Station)
    return { longitude: 21.0122, latitude: 52.2297 };
  }

  async getReporter(userId: string): Promise<Reporter> {
    // For now, all users are regular USER type reporters
    return {
      id: userId,
      type: ReporterType.USER
    };
  }

  async getActiveJourney(userId: string): Promise<RouteReference | null> {
    // Check if user has an active journey
    if (this.userJourneys.has(userId)) {
      return this.userJourneys.get(userId) || null;
    }

    // Return null if no active journey
    return null;
  }

  // Helper methods for testing - simulate user state
  setUserLocation(userId: string, location: Location): void {
    this.userLocations.set(userId, location);
  }

  setUserJourney(userId: string, journey: RouteReference | null): void {
    this.userJourneys.set(userId, journey);
  }

  clearUserData(userId: string): void {
    this.userLocations.delete(userId);
    this.userJourneys.delete(userId);
  }
}

