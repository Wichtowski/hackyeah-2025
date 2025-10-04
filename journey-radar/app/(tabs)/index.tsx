import { useState } from 'react';
import { Alert } from 'react-native';
import TransportSelector from '@/components/transport-selector';
import { StationInput } from '@/components/station-input';
import { Header } from '@/components/header';
import ApiHealthButton from '@/components/api-health-button';
import { useRoute } from '@/contexts/RouteContext';
import { useJourney } from '@/contexts/JourneyContext';
import { Journey } from '@/types/journey';
import { JourneysList } from '@/components/journeys-list';
import { useStationState } from '@/hooks/use-station-state';
import {Station} from "@/types/station";

export default function HomeScreen() {
  const { sourceStation, destinationStation, setSourceStation, setDestinationStation } = useRoute();
  const { getLastUsedJourneys, removeSavedJourney, setCurrentJourney } = useJourney();

  const handleSourceChange = (station: Station | null): void => {
    setSourceStation(station);
    console.log('Source station set to:', station);
  };

  const handleDestinationChange = (station: Station | null): void => {
    setDestinationStation(station);
    console.log('Destination station set to:', station);
  };

  const handleDeleteJourney = (journeyId: string) => {
    Alert.alert(
      'Delete Journey',
      'Are you sure you want to remove this journey?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeSavedJourney(journeyId);
          }
        }
      ]
    );
  };

  const handleUseJourney = (journey: Journey) => {
    // Extract stations from journey segments
    const firstSegment = journey.routes[0];
    const lastSegment = journey.routes[journey.routes.length - 1];

    // Create station objects from the journey data
    const sourceStation: Station = {
      id: `source_${firstSegment.id}`,
      name: firstSegment.from,
      coordinates: { latitude: 52.2297, longitude: 21.0122 }, // Mock coordinates
      type: firstSegment.communicationMethod === 'train' ? 'train' : 'bus'
    };

    const destinationStation: Station = {
      id: `dest_${lastSegment.id}`,
      name: lastSegment.to,
      coordinates: { latitude: 52.2319, longitude: 21.0067 }, // Mock coordinates
      type: lastSegment.communicationMethod === 'train' ? 'train' : 'bus'
    };

    // Set the stations in the route context
    setSourceStation(sourceStation);
    setDestinationStation(destinationStation);

    // Set as current journey
    setCurrentJourney(journey);

    console.log('Using journey:', journey);
  };

  // Get last used journeys sorted by most recent
  const lastUsedJourneys = getLastUsedJourneys();

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

      <JourneysList
        journeys={lastUsedJourneys}
        title="Recent Journeys"
        icon="time"
        emptyStateTitle="No Recent Journeys"
        emptyStateText="Your recently used journeys will appear here."
        onUseJourney={handleUseJourney}
        onDeleteJourney={handleDeleteJourney}
        showActions={true}
      />
    </div>
  );
}
