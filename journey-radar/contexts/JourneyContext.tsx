import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Journey, Route, Station as JourneyStation, CommunicationMethod } from '@/types/journey';
import { Station } from '@/types/station';

interface JourneyContextType {
  currentJourney: Journey | null;
  savedJourneys: Journey[];
  setCurrentJourney: (journey: Journey | null) => void;
  addSavedJourney: (journey: Journey) => void;
  removeSavedJourney: (journeyId: string) => void;
  updateJourneyStatus: (journeyId: string, routeId: string) => void;
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

// Sample journeys data - based on the journey.tsx structure
const mockJourneys: Journey[] = [
  {
    id: '1',
    title: '',
    distance: 250000,
    duration: 14400,
    routes: [
      {
        id: '1',
        communicationMethod: 'train',
        duration: 7200,
        stations: [
          {
            id: '1',
            name: 'Kraków Łagiewniki',
          },
          {
            id: '2',
            name: 'Warszawa Centralna',
          },
          {
            id: '3',
            name: 'Warszawa Powiśle',
          },
          {
            id: '4',
            name: 'Warszawa Powion',
          }
        ],
        delay: {
          time: 100,
          description: 'Małe opóźnienia zgłoszone'
        },
        incidents: [
          {
            id: '1',
            stationId: '3',
            position: { longitude: 21.0122, latitude: 52.2297 },
            description: 'Awaria/problem zgłoszony',
            severity: 'high',
            type: 'cancelled'
          }
        ]
      },
      {
        id: '2',
        communicationMethod: 'bus',
        duration: 7200,
        stations: [
          {
            id: '5',
            name: 'Warszawa Powion',
          },
          {
            id: '6',
            name: 'Warszawa Stadion',
          },
          {
            id: '7',
            name: 'Praga Południe',
          }
        ],
        delay: {
          time: 300,
          description: 'Małe opóźnienia zgłoszone'
        },
        incidents: []
      }
    ]
  },
  {
    id: '2',
    title: '',
    distance: 180000,
    duration: 10800,
    routes: [
      {
        id: '3',
        communicationMethod: 'tram',
        duration: 3600,
        stations: [
          {
            id: '8',
            name: 'Wola Park',
          },
          {
            id: '9',
            name: 'Rondo Daszyńskiego',
          },
          {
            id: '10',
            name: 'Plac Bankowy',
          }
        ],
        delay: {
          time: 60,
          description: 'Lekkie opóźnienie'
        },
        incidents: [
          {
            id: '2',
            stationId: '9',
            position: { longitude: 20.9843, latitude: 52.2319 },
            description: 'Tymczasowe problemy z połączeniem',
            severity: 'medium',
            type: 'delay'
          }
        ]
      },
      {
        id: '4',
        communicationMethod: 'train',
        duration: 7200,
        stations: [
          {
            id: '11',
            name: 'Plac Bankowy',
          },
          {
            id: '12',
            name: 'Warszawa Śródmieście',
          },
          {
            id: '13',
            name: 'Warszawa Centralna',
          },
          {
            id: '14',
            name: 'Dworzec Główny',
          }
        ],
        delay: {
          time: 0
        },
        incidents: []
      }
    ]
  },
  {
    id: '3',
    title: '',
    distance: 120000,
    duration: 5400,
    routes: [
      {
        id: '5',
        communicationMethod: 'bus',
        duration: 5400,
        stations: [
          {
            id: '15',
            name: 'Centrum',
          },
          {
            id: '16',
            name: 'Wilanów',
          },
          {
            id: '17',
            name: 'Lotnisko Chopina',
          }
        ],
        delay: {
          time: 240,
          description: 'Opóźnienia w ruchu'
        },
        incidents: [
          {
            id: '3',
            stationId: '16',
            position: { longitude: 21.0895, latitude: 52.1672 },
            description: 'Korki na trasie',
            severity: 'small',
            type: 'delay'
          }
        ]
      }
    ]
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

  const updateJourneyStatus = (journeyId: string, routeId: string) => {
    setSavedJourneys(prev =>
      prev.map(journey => {
        if (journey.id === journeyId) {
          return {
            ...journey,
            routes: journey.routes.map(route =>
              route.id === routeId
                ? { ...route, delay: { time: Date.now() % 300, description: 'Updated' } }
                : route
            )
          };
        }
        return journey;
      })
    );
  };

  const createJourneyFromStations = (source: Station, destination: Station): Journey => {
    const journeyId = `journey_${Date.now()}`;
    const routeId = `route_${Date.now()}`;

    return {
      id: journeyId,
      title: `${source.name} to ${destination.name}`,
      distance: 15000,
      duration: 900,
      routes: [
        {
          id: routeId,
          stations: [
            {
              id: source.id,
              name: source.name,
              position: {
                latitude: source.coordinates.latitude,
                longitude: source.coordinates.longitude
              }
            },
            {
              id: `dest_${Date.now()}`,
              name: destination.name,
              position: {
                latitude: destination.coordinates.latitude,
                longitude: destination.coordinates.longitude
              }
            }
          ],
          communicationMethod: source.type === 'train' ? 'train' : 'bus',
          duration: 900,
          delay: { time: 0 },
          incidents: []
        }
      ]
    };
  };

  const getLastUsedJourneys = (): Journey[] => {
    // Sort by ID as a proxy for last used (most recent IDs first)
    return savedJourneys.sort((a, b) => b.id.localeCompare(a.id));
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
