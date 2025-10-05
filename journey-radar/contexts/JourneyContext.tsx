import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Journey, Station as JourneyStation } from '@/types/journey';

interface JourneyContextType {
  currentJourney: Journey | null;
  savedJourneys: Journey[];
  favoriteJourneys: Journey[];
  setCurrentJourney: (journey: Journey | null) => void;
  addSavedJourney: (journey: Journey) => void;
  removeSavedJourney: (journeyId: string) => void;
  addFavoriteJourney: (journey: Journey) => void;
  removeFavoriteJourney: (journeyId: string) => void;
  isFavorite: (journeyId: string) => boolean;
  updateJourneyStatus: (journeyId: string, routeId: string) => void;
  createJourneyFromStations: (source: JourneyStation, destination: JourneyStation) => Journey;
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

export const JourneyProvider: React.FC<JourneyProviderProps> = ({ children }) => {
  const [currentJourney, setCurrentJourney] = useState<Journey | null>(null);
  const [savedJourneys, setSavedJourneys] = useState<Journey[]>([]);
  const [favoriteJourneys, setFavoriteJourneys] = useState<Journey[]>([]);

  const addSavedJourney = (journey: Journey) => {
    setSavedJourneys(prev => [...prev, journey]);
  };

  const removeSavedJourney = (journeyId: string) => {
    setSavedJourneys(prev => prev.filter(journey => journey.id !== journeyId));
  };

  const addFavoriteJourney = (journey: Journey) => {
    setFavoriteJourneys(prev => {
      // Prevent duplicates
      if (prev.some(j => j.id === journey.id)) {
        return prev;
      }
      return [...prev, journey];
    });
  };

  const removeFavoriteJourney = (journeyId: string) => {
    setFavoriteJourneys(prev => prev.filter(journey => journey.id !== journeyId));
  };

  const isFavorite = (journeyId: string): boolean => {
    return favoriteJourneys.some(journey => journey.id === journeyId);
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

  const createJourneyFromStations = (source: JourneyStation, destination: JourneyStation): Journey => {
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
              position: source.position
            },
            {
              id: `dest_${Date.now()}`,
              name: destination.name,
              position: destination.position
            }
          ],
          communicationMethod: 'bus',
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
        favoriteJourneys,
        setCurrentJourney,
        addSavedJourney,
        removeSavedJourney,
        addFavoriteJourney,
        removeFavoriteJourney,
        isFavorite,
        updateJourneyStatus,
        createJourneyFromStations,
        getLastUsedJourneys,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};
