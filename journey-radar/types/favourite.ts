import { Station } from './station';

export interface FavouriteRoute {
  id: string;
  name: string;
  source: Station;
  destination: Station;
  createdAt: Date;
  lastUsed?: Date;
}
