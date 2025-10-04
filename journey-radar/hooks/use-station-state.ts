import { useState } from 'react';
import { Station } from '@/types/station';

interface UseStationStateReturn {
  sourceStation: Station | null;
  destinationStation: Station | null;
  handleSourceChange: (station: Station | null) => void;
  handleDestinationChange: (station: Station | null) => void;
}

export const useStationState = (): UseStationStateReturn => {
  const [sourceStation, setSourceStation] = useState<Station | null>(null);
  const [destinationStation, setDestinationStation] = useState<Station | null>(null);

  const handleSourceChange = (station: Station | null): void => {
    setSourceStation(station);
  };

  const handleDestinationChange = (station: Station | null): void => {
    setDestinationStation(station);
  };

  return {
    sourceStation,
    destinationStation,
    handleSourceChange,
    handleDestinationChange,
  };
};

