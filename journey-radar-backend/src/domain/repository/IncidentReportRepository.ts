import { IncidentReport } from '../model/IncidentReport';

export interface IncidentReportRepository {
  save(incidentReport: IncidentReport): Promise<IncidentReport>;
  findById(id: string): Promise<IncidentReport | null>;
  findAll(): Promise<IncidentReport[]>;
  findByLocation(longitude: number, latitude: number, radiusKm: number): Promise<IncidentReport[]>;
  findByRoute(origin: string, destination: string): Promise<IncidentReport[]>;
}

