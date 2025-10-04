import { useState } from 'react';
import { MapContainer } from '@/components/map-container';
import TransportSelector from '@/components/transport-selector';
import SlideTab from '@/components/slide-tab';
import DefaultCommuteSettings from '@/components/default-commute-settings';
import { CommuteType } from '@/types/commuting';
import ApiHealthButton from '@/components/api-health-button';

export default function HomeScreen() {
  const [isSlideTabVisible, setIsSlideTabVisible] = useState(false);
  const [defaultCommuteType, setDefaultCommuteType] = useState<CommuteType | null>(null);

  const handleCommuteTypeSelect = (type: CommuteType): void => {
    setDefaultCommuteType(type);
    console.log('Default commute type set to:', type);
  };

  return (
    <>
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <MapContainer />
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
        {/* Settings Button */}
        <button
          onClick={() => setIsSlideTabVisible(true)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '25px',
            backgroundColor: '#687076',
            border: 'none',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          ⚙️
        </button>
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
