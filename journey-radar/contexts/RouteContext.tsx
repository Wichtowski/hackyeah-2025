import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Station } from '@/types/journey';

interface RouteContextType {
  sourceStation: Station | null;
  destinationStation: Station | null;
  selectedMapStation: Station | null;
  setSourceStation: (station: Station | null) => void;
  setDestinationStation: (station: Station | null) => void;
  setSelectedMapStation: (station: Station | null) => void;
  setRoute: (source: Station, destination: Station) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
};

interface RouteProviderProps {
  children: ReactNode;
}

export const RouteProvider: React.FC<RouteProviderProps> = ({ children }) => {
  const [sourceStation, setSourceStation] = useState<Station | null>(null);
  const [destinationStation, setDestinationStation] = useState<Station | null>(null);
  const [selectedMapStation, setSelectedMapStation] = useState<Station | null>(null);

  const setRoute = (source: Station, destination: Station) => {
    setSourceStation(source);
    setDestinationStation(destination);
  };

  return (
    <RouteContext.Provider
      value={{
        sourceStation,
        destinationStation,
        selectedMapStation,
        setSourceStation,
        setDestinationStation,
        setSelectedMapStation,
        setRoute,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};
