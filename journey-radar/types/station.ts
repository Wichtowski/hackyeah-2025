import {CommuteType} from "@/types/commuting";

export interface Station {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: CommuteType;
}

export interface StationInputProps {
  onSourceChange: (station: Station | null) => void;
  onDestinationChange: (station: Station | null) => void;
  sourceStation: Station | null;
  destinationStation: Station | null;
  absolutePosition?: boolean;
  enableChevron?: boolean;
  onSearch?: (source: string, destination: string) => void;
}
