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
