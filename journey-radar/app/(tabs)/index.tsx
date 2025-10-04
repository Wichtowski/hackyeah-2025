import { useState } from 'react';
import TransportSelector from '@/components/transport-selector';
import { StationInput } from '@/components/station-input';
import { Header } from '@/components/header';
import { Station } from '@/types/station';
import ApiHealthButton from '@/components/api-health-button';

export default function HomeScreen() {
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
      <Header />
      <StationInput
        onSourceChange={handleSourceChange}
        onDestinationChange={handleDestinationChange}
        sourceStation={sourceStation}
        destinationStation={destinationStation}
        absolutePosition={false}
      />
      <TransportSelector />
      {/* ApiHealthButton positioned to the left of TransportSelector */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px', // align vertically with TransportSelector (which uses bottom:100px)
          right: '100px',  // offset left from TransportSelector's right:20px + button width (60px) + gap (20px)
          zIndex: 1000,
        }}
      >
        <ApiHealthButton />
      </div>
    </div>
  );
}
