import { UserContextService } from '../../domain/service/UserContextService';
import { Location, Reporter, ReporterType, RouteReference } from '../../domain/model/IncidentReport';
import { UserLocationRepository } from '../../domain/repository/UserLocationRepository';

/**
 * Mock implementation of UserContextService for testing and development
 * In production, this would integrate with actual tracking and journey management systems
 */
export class MockUserContextService implements UserContextService {
  private userJourneys: Map<string, RouteReference | null> = new Map();

  constructor(private readonly userLocationRepository: UserLocationRepository) {}

  async getCurrentLocation(userId: string): Promise<Location> {
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
    // This is now deprecated in favor of using the repository directly
    // Kept for backward compatibility with existing tests
    this.userLocationRepository.saveLocation({
      userId,
      longitude: location.longitude,
      latitude: location.latitude,
      timestamp: new Date()
    });
  }

  setUserJourney(userId: string, journey: RouteReference | null): void {
    this.userJourneys.set(userId, journey);
  }

  clearUserData(userId: string): void {
    // Note: This won't clear the repository data, only journey data
    this.userJourneys.delete(userId);
  }
}
