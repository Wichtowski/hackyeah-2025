import { IncidentReport } from '../../domain/model/IncidentReport';
import { IncidentReportRepository } from '../../domain/repository/IncidentReportRepository';

export class InMemoryIncidentReportRepository implements IncidentReportRepository {
  private incidents: Map<string, IncidentReport> = new Map();

  async save(incidentReport: IncidentReport): Promise<IncidentReport> {
    // Generate ID if not provided (using timestamp-based ID)
    const id = incidentReport.id || this.generateId();
    const reportWithId = new IncidentReport(
      id,
      incidentReport.location,
      incidentReport.reporter,
      incidentReport.incidentType,
      incidentReport.details,
      incidentReport.timestamp,
      incidentReport.description
    );

    this.incidents.set(reportWithId.id, reportWithId);
    return reportWithId;
  }

  async findById(id: string): Promise<IncidentReport | null> {
    return this.incidents.get(id) || null;
  }

  async findAll(): Promise<IncidentReport[]> {
    return Array.from(this.incidents.values());
  }

  async findByLocation(longitude: number, latitude: number, radiusKm: number): Promise<IncidentReport[]> {
    const incidents = Array.from(this.incidents.values());

    return incidents.filter(incident => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        incident.location.latitude,
        incident.location.longitude
      );
      return distance <= radiusKm;
    });
  }

  async findByRoute(origin: string, destination: string): Promise<IncidentReport[]> {
    const incidents = Array.from(this.incidents.values());

    return incidents.filter(incident => {
      const route = incident.details.reportedOnRoute;
      return route && route.origin === origin && route.destination === destination;
    });
  }

  // Haversine formula to calculate distance between two coordinates in km
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private generateId(): string {
    return `incident-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
