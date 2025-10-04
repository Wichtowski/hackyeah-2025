export interface Station {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: 'bus' | 'tram' | 'train';
}

export interface StationInputProps {
  onSourceChange: (station: Station | null) => void;
  onDestinationChange: (station: Station | null) => void;
  sourceStation: Station | null;
  destinationStation: Station | null;
}
