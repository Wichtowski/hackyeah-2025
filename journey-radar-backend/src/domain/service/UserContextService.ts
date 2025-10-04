import { Location, Reporter, RouteReference } from '../model/IncidentReport';

/**
 * Service to retrieve user context including their current location and active journey
 */
export interface UserContextService {
  /**
   * Get the current location of the user based on their device/session
   * @param userId - The user identifier
   * @returns The current location of the user
   */
  getCurrentLocation(userId: string): Promise<Location>;

  /**
   * Get the reporter information for the user
   * @param userId - The user identifier
   * @returns The reporter details
   */
  getReporter(userId: string): Promise<Reporter>;

  /**
   * Get the user's active journey/route if they are currently on one
   * @param userId - The user identifier
   * @returns The active route reference or null if not on a journey
   */
  getActiveJourney(userId: string): Promise<RouteReference | null>;
}

