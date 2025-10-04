export type RouteStatus = 'on-time' | 'delay' | 'problem' | 'cancelled';

export type CommunicationMethod = 'bus' | 'train' | 'tram' | 'walk';

export interface RouteSegment {
  id: string;
  from: string;
  to: string;
  communicationMethod: CommunicationMethod;
  status: RouteStatus;
  eta?: string;
  delayMinutes?: number;
  problemDescription?: string;
}

export interface Journey {
  id: string;
  title: string;
  routes: RouteSegment[];
  totalDuration?: string;
  lastUpdated: Date;
}

export interface StatusUpdate {
  type: 'delay' | 'problem' | 'cancelled';
  message: string;
  severity: 'small' | 'medium' | 'high';
}
