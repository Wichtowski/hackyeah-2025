import { UserLocation } from '../model/UserLocation';

export interface UserLocationRepository {
  saveLocation(userLocation: UserLocation): Promise<UserLocation>;
  getLocation(userId: string): Promise<UserLocation | null>;
  getAllLocations(): Promise<UserLocation[]>;
}

