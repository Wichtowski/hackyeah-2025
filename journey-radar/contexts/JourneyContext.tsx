import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Journey, RouteSegment } from '@/types/journey';
import { Station } from '@/types/station';

interface JourneyContextType {
  currentJourney: Journey | null;
  savedJourneys: Journey[];
  setCurrentJourney: (journey: Journey | null) => void;
  addSavedJourney: (journey: Journey) => void;
  removeSavedJourney: (journeyId: string) => void;
  updateJourneyStatus: (journeyId: string, routeSegmentId: string, status: string) => void;
  createJourneyFromStations: (source: Station, destination: Station) => Journey;
  getLastUsedJourneys: () => Journey[];
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};

interface JourneyProviderProps {
  children: ReactNode;
}

// Sample journeys data - converting from the old route format
const mockJourneys: Journey[] = [
  {
    id: '1',
    title: 'Central Station to Business District',
    routes: [
      {
        id: 'segment_1',
        from: 'Central Station',
        to: 'Business District',
        communicationMethod: 'bus',
        status: 'on-time',
        eta: '09:15'
      }
    ],
    totalDuration: '15 min',
    lastUpdated: new Date('2024-10-04')
  },
  {
    id: '2',
    title: 'Old Town Square to University Campus',
    routes: [
      {
        id: 'segment_2',
        from: 'Old Town Square',
        to: 'University Campus',
        communicationMethod: 'bus',
        status: 'on-time',
        eta: '10:30'
      }
    ],
    totalDuration: '20 min',
    lastUpdated: new Date('2024-10-02')
  },
  {
    id: '3',
    title: 'Residential Area to Shopping Mall',
    routes: [
      {
        id: 'segment_3',
        from: 'Residential Area',
        to: 'Shopping Mall',
        communicationMethod: 'bus',
        status: 'on-time',
        eta: '11:00'
      }
    ],
    totalDuration: '25 min',
    lastUpdated: new Date('2024-09-20')
  }
];

export const JourneyProvider: React.FC<JourneyProviderProps> = ({ children }) => {
  const [currentJourney, setCurrentJourney] = useState<Journey | null>(null);
  const [savedJourneys, setSavedJourneys] = useState<Journey[]>(mockJourneys);

  const addSavedJourney = (journey: Journey) => {
    setSavedJourneys(prev => [...prev, journey]);
  };

  const removeSavedJourney = (journeyId: string) => {
    setSavedJourneys(prev => prev.filter(journey => journey.id !== journeyId));
  };

  const updateJourneyStatus = (journeyId: string, routeSegmentId: string, status: string) => {
    setSavedJourneys(prev =>
      prev.map(journey => {
        if (journey.id === journeyId) {
          return {
            ...journey,
            routes: journey.routes.map(segment =>
              segment.id === routeSegmentId
                ? { ...segment, status: status as any }
                : segment
            ),
            lastUpdated: new Date()
          };
        }
        return journey;
      })
    );
  };

  const createJourneyFromStations = (source: Station, destination: Station): Journey => {
    const journeyId = `journey_${Date.now()}`;
    const segmentId = `segment_${Date.now()}`;

    return {
      id: journeyId,
      title: `${source.name} to ${destination.name}`,
      routes: [
        {
          id: segmentId,
          from: source.name,
          to: destination.name,
          communicationMethod: source.type === 'train' ? 'train' : 'bus',
          status: 'on-time',
          eta: new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ],
      totalDuration: '15 min',
      lastUpdated: new Date()
    };
  };

  const getLastUsedJourneys = (): Journey[] => {
    return savedJourneys
      .filter(journey => journey.lastUpdated)
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  };

  return (
    <JourneyContext.Provider
      value={{
        currentJourney,
        savedJourneys,
        setCurrentJourney,
        addSavedJourney,
        removeSavedJourney,
        updateJourneyStatus,
        createJourneyFromStations,
        getLastUsedJourneys,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};
