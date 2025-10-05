import {StationInput} from '@/components/station-input';
import {Header} from '@/components/header';
import ApiHealthButton from '@/components/api-health-button';
import {useStationState} from '@/hooks/use-station-state';

export default function HomeScreen() {
  const {sourceStation, destinationStation, handleSourceChange, handleDestinationChange} = useStationState();

  return (
    <div style={{position: 'relative', width: '100%', height: '100vh'}}>
      <Header/>
      <StationInput
        onSourceChange={handleSourceChange}
        onDestinationChange={handleDestinationChange}
        sourceStation={sourceStation}
        destinationStation={destinationStation}
        absolutePosition={false}
      />
      {/* ApiHealthButton positioned to the left of TransportSelector */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px', // align vertically with TransportSelector (which uses bottom:100px)
          right: '100px',  // offset left from TransportSelector's right:20px + button width (60px) + gap (20px)
          zIndex: 1000,
        }}
      >
        <ApiHealthButton/>
      </div>
    </div>
  );
}
