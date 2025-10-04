export interface Location {
  longitude: number;
  latitude: number;
}

export interface RouteReference {
  origin: string;
  destination: string;
  transportVehicleId: string;
}

export enum IncidentType {
  ISSUES = 'ISSUES',
  DELAY = 'DELAY',
  SEVERE_BLOCKER = 'SEVERE_BLOCKER'
}

export enum ReporterType {
  USER = 'USER',
  DISPATCHER = 'DISPATCHER',
  EXTERNAL_SYSTEM = 'EXTERNAL_SYSTEM'
}

export interface Reporter {
  id: string;
  type: ReporterType;
}

export interface IncidentReportDetails {
  reportedOnRoute: RouteReference | null;
}

export class IncidentReport {
  constructor(
    public readonly id: string,
    public readonly location: Location,
    public readonly reporter: Reporter,
    public readonly incidentType: IncidentType,
    public readonly details: IncidentReportDetails,
    public readonly timestamp: Date,
    public readonly description?: string
  ) {}
}
