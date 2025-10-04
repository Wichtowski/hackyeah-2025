import { MapContainer } from '@/components/map-container';
import { StationInput } from '@/components/station-input';
import { Header } from '@/components/header';
import { useStationState } from '@/hooks/use-station-state';

export default function MapScreen() {
  const { sourceStation, destinationStation, handleSourceChange, handleDestinationChange } = useStationState();

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
