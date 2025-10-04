export type Longitude = number;
export type Latitude = number;
export type Distance = number;
export type Duration = number;
export type Time = number;

export interface Position {
  longitude: Longitude;
  latitude: Latitude;
}

export interface Station {
  id: string;
  name: string;
  position?: Position;
}

export interface Delay {
  time: Time;
  description?: string;
}

export interface Incident {
  id: string;
  stationId: string;
  position: Position;
  description: string;
  severity: 'small' | 'medium' | 'high';
  type: 'delay' | 'problem' | 'cancelled';
}

export type CommunicationMethod = 'bus' | 'train' | 'tram' | 'walk';

export interface Route {
  id: string;
  stations: Station[];
  delay: Delay;
  incidents: Incident[];
  communicationMethod: CommunicationMethod;
  duration: Duration;
}

export interface Journey {
  id: string;
  routes: Route[];
  distance: Distance;
  duration: Duration;
  title?: string;
}

export interface JourneyState {
  journey_id: string;
  route_index: number;
  position: number;
  updated_at: string;
}
