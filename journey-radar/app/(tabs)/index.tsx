import { useState } from 'react';
import { MapContainer } from '@/components/map-container';
import TransportSelector from '@/components/transport-selector';
import SlideTab from '@/components/slide-tab';
import DefaultCommuteSettings from '@/components/default-commute-settings';
import { StationInput } from '@/components/station-input';
import { Header } from '@/components/header';
import { CommuteType } from '@/types/commuting';
import { Station } from '@/types/station';
import ApiHealthButton from '@/components/api-health-button';

export default function HomeScreen() {
  const [isSlideTabVisible, setIsSlideTabVisible] = useState(false);
  const [defaultCommuteType, setDefaultCommuteType] = useState<CommuteType | null>(null);
  const [sourceStation, setSourceStation] = useState<Station | null>(null);
  const [destinationStation, setDestinationStation] = useState<Station | null>(null);

  const handleCommuteTypeSelect = (type: CommuteType): void => {
    setDefaultCommuteType(type);
    console.log('Default commute type set to:', type);
  };

  const handleSourceChange = (station: Station | null): void => {
    setSourceStation(station);
    console.log('Source station set to:', station);
  };

  const handleDestinationChange = (station: Station | null): void => {
    setDestinationStation(station);
    console.log('Destination station set to:', station);
  };

  return (
    <>
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <MapContainer />
        <Header onSettingsPress={() => setIsSlideTabVisible(true)} />
        <StationInput
          onSourceChange={handleSourceChange}
          onDestinationChange={handleDestinationChange}
          sourceStation={sourceStation}
          destinationStation={destinationStation}
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

      <SlideTab
        visible={isSlideTabVisible}
        onClose={() => setIsSlideTabVisible(false)}
        title="Commute Settings"
      >
        <DefaultCommuteSettings
          selectedType={defaultCommuteType}
          onTypeSelect={handleCommuteTypeSelect}
        />
      </SlideTab>
    </>
  );
}
