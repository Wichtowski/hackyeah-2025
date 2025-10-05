import { JourneyRadarCapabilities } from './JourneyRadarCapabilities';
import { IncidentReport } from '../model/IncidentReport';
import { IncidentReportRepository } from '../repository/IncidentReportRepository';
import { UserContextService } from '../service/UserContextService';
import { UserLocationRepository } from '../repository/UserLocationRepository';
import { Coordinates, Destination, Journey, JourneyProgress, JourneyStartResponse, Origin } from '../model/Journey';
import { JourneyService } from '../service/JourneyService';
import { JourneyProgressService } from '../service/JourneyProgressService';
import { JourneyProgressRepository } from '../repository/JourneyProgressRepository';
import { FinishedJourneyRepository } from '../repository/FinishedJourneyRepository';
import { FinishedJourney } from '../model/FinishedJourney';
import { InMemoryJourneyProgressRepository } from '@adapter/repository/InMemoryJourneyProgressRepository';
import { JourneySessionService } from '../service/JourneySessionService';
import { IncidentReportingService } from '../service/IncidentReportingService';
import { FinishedJourneyService } from '../service/FinishedJourneyService';
import { JourneyProgressOrchestrator } from '../service/JourneyProgressOrchestrator';

const sessions: Map<string, Journey> = new Map();
const journeyIdToStartedAt: Map<string, string> = new Map();
const journeyIdToUserId: Map<string, string> = new Map();

export class JourneyRadarFacade implements JourneyRadarCapabilities {
  private readonly journeyProgressService: JourneyProgressService;
  private readonly journeySessionService: JourneySessionService;
  private readonly incidentReportingService: IncidentReportingService;
  private readonly finishedJourneyService: FinishedJourneyService;
  private readonly progressOrchestrator: JourneyProgressOrchestrator;

  constructor(
    private readonly incidentReportRepository: IncidentReportRepository,
    private readonly userContextService: UserContextService,
    private readonly userLocationRepository: UserLocationRepository,
    journeyProgressRepository?: JourneyProgressRepository,
    private readonly finishedJourneyRepository?: FinishedJourneyRepository,
    private readonly journeyService: JourneyService = new JourneyService(incidentReportRepository)
  ) {
    const repo = journeyProgressRepository ?? new InMemoryJourneyProgressRepository();
    this.journeyProgressService = new JourneyProgressService(repo);
    this.journeySessionService = new JourneySessionService();
    this.incidentReportingService = new IncidentReportingService(incidentReportRepository, userContextService);
    this.finishedJourneyService = new FinishedJourneyService(finishedJourneyRepository);
    this.progressOrchestrator = new JourneyProgressOrchestrator(
      this.journeyService,
      this.journeyProgressService,
      this.journeySessionService,
      this.finishedJourneyService,
    );
  }

  async checkHealth(): Promise<{ status: string; domain: string }> {
    return { status: 'OK', domain: 'JourneyRadar' };
  }

  async reportIncident(userId: string, incidentType: string, description?: string): Promise<IncidentReport> {
    const saved = await this.incidentReportingService.reportIncident(userId, incidentType, description);

    // If incident is tied to a route, update all active journeys matching that route
    const routeRef = saved.details.reportedOnRoute;
    if (routeRef) {
      const sessions = this.journeySessionService.getAllSessions();
      for (const { journeyId, journey } of sessions) {
        // Determine if any route in journey matches the origin/destination by names
        const matches = journey.routes.some(r => {
          const first = r.stations[0]?.name;
          const last = r.stations[r.stations.length - 1]?.name;
          return first === routeRef.origin && last === routeRef.destination;
        });
        if (!matches) continue;

        // Recompute incidents for each matching route using JourneyService mapping
        const updatedRoutes = await Promise.all(journey.routes.map(async (r) => {
          const first = r.stations[0]?.name;
          const last = r.stations[r.stations.length - 1]?.name;
          if (first === routeRef.origin && last === routeRef.destination) {
            // compute incidents for this route only
            const incidents = await (this.journeyService as any).findIncidentsForRoute(first, last, r.stations);
            return { ...r, incidents };
          }
          return r;
        }));

        const updatedJourney = { ...journey, routes: updatedRoutes };
        this.journeySessionService.setJourney(journeyId, updatedJourney);
      }
    }

    return saved;
  }

  async mockUserLocation(userId: string, longitude: number, latitude: number): Promise<{ userId: string; longitude: number; latitude: number }> {
    console.log(`Domain: Mocking location for user ${userId} at (${latitude}, ${longitude})`);

    await this.userLocationRepository.saveLocation({
      userId,
      longitude,
      latitude,
      timestamp: new Date()
    });

    return { userId, longitude, latitude };
  }

  async getJourney(origin: Origin, destination: Destination): Promise<Journey> {
    return this.journeyService.computeJourney(origin, destination);
  }

  async startJourney(journey: Journey): Promise<JourneyStartResponse> {
    return this.journeySessionService.startJourney(journey);
  }

  async getJourneyProgress(journeyId: string, coordinates: Coordinates, userId?: string): Promise<JourneyProgress> {
    return this.progressOrchestrator.computeAndPersist(journeyId, coordinates, userId);
  }

  async getFinishedJourneys(userId: string): Promise<FinishedJourney[]> {
    return this.finishedJourneyService.findByUserId(userId);
  }
}
