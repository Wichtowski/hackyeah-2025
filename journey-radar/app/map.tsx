import { useState } from 'react';
import { MapContainer } from '@/components/map-container';
import { StationInput } from '@/components/station-input';
import { Header } from '@/components/header';
import { Station } from '@/types/station';

export default function MapScreen() {
  const [sourceStation, setSourceStation] = useState<Station | null>(null);
  const [destinationStation, setDestinationStation] = useState<Station | null>(null);

  const handleSourceChange = (station: Station | null): void => {
    setSourceStation(station);
    console.log('Source station set to:', station);
  };

  const handleDestinationChange = (station: Station | null): void => {
    setDestinationStation(station);
    console.log('Destination station set to:', station);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <MapContainer />
      <Header absolutePosition={true}/>
        <StationInput
          onSourceChange={handleSourceChange}
          onDestinationChange={handleDestinationChange}
          sourceStation={sourceStation}
          destinationStation={destinationStation}
          enableChevron={true}
        />
    </div>
  );
}
