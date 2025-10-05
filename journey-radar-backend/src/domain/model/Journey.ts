export type Longitude = number;
export type Latitude = number;
export type Distance = number;
export type Duration = number;
export type Time = number;
export type ConnectionId = number;

export interface Station { name: string }
export interface Delay { time: Time }

export interface Connection {
  id: ConnectionId;
  from: Station;
  to: Station;
  incident?: Incident;
}

export interface Incident {
  connection: Connection;
}

export interface Route {
  stations: Station[];
  delay: Delay;
  incidents: Incident[];
}

export interface Journey {
  routes: Route[];
  distance: Distance;
  duration: Duration;
}

export interface Origin { station: Station }
export interface Destination { station: Station }
export interface Coordinates { longitude: Longitude; latitude: Latitude }

export interface JourneyStartState { route_index: number; position_in_route: number; updated_at: string }
export interface JourneyStartResponse { journey_id: string; state: JourneyStartState }

export interface Progress { currentRoute: number; currentStage: number; currentConnection: Connection }
export interface JourneyProgress { routes: Route[]; progress: Progress; delay: Delay; firstStation: Station; lastStation: Station }
