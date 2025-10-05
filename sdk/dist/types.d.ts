export interface HealthResult {
    message: string;
}
export interface Location {
    longitude: number;
    latitude: number;
}
export interface RouteReference {
    origin: string;
    destination: string;
    transportVehicleId: string;
}
export declare enum IncidentType {
    ISSUES = "ISSUES",
    DELAY = "DELAY",
    SEVERE_BLOCKER = "SEVERE_BLOCKER"
}
export declare enum ReporterType {
    USER = "USER",
    DISPATCHER = "DISPATCHER",
    EXTERNAL_SYSTEM = "EXTERNAL_SYSTEM"
}
export interface Reporter {
    id: string;
    type: ReporterType;
}
export interface IncidentReportDetails {
    reportedOnRoute: RouteReference | null;
}
export interface CreateIncidentRequest {
    userId: string;
    incidentType: IncidentType;
    description?: string;
}
export interface IncidentReport {
    id: string;
    location: Location;
    reporter: Reporter;
    incidentType: IncidentType;
    details: IncidentReportDetails;
    timestamp: Date;
    description?: string;
}
export type Longitude = number;
export type Latitude = number;
export type Distance = number;
export type Duration = number;
export type Time = number;
export type ConnectionId = number;
export interface Station {
    name: string;
}
export interface Delay {
    time: Time;
}
export interface Connection {
    id: ConnectionId;
    from: Station;
    to: Station;
    incident?: Incident;
}
export interface Incident {
    severity: 'small' | 'medium' | 'high';
    type: 'delay' | 'problem' | 'cancelled';
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
    durationInSeconds: Duration;
}
export interface Origin {
    station: Station;
}
export interface Destination {
    station: Station;
}
export interface Coordinates {
    longitude: Longitude;
    latitude: Latitude;
}
export interface JourneyStartResponse {
    journey_id: string;
}
export interface Progress {
    currentRoute: number;
    currentStage: number;
    currentConnection: Connection;
}
export interface JourneyProgress {
    journeyId: string;
    routes: Route[];
    progress: Progress;
    delay: Delay;
    firstStation: Station;
    lastStation: Station;
}
export interface FinishedJourney {
    userId: string;
    journeyId: string;
    from: {
        name: string;
    };
    to: {
        name: string;
    };
    startedAt: string;
    finishedAt: string;
}
export interface ApiClient {
    getJourney(origin: Origin, destination: Destination): Promise<Journey>;
    startJourney(journey: Journey): Promise<JourneyStartResponse>;
    getJourneyStage(journeyId: string, coordinates: Coordinates): Promise<JourneyProgress>;
    healthCheck(): Promise<HealthResult>;
    getJourneyHistory(userId: string): Promise<FinishedJourney[]>;
}
