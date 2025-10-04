import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from "@/components/header";
import { useRoute } from '@/contexts/RouteContext';
import { useJourney } from '@/contexts/JourneyContext';
import { Journey } from '@/types/journey';
import { Station } from '@/types/station';
import { JourneysList } from '@/components/journeys-list';

export default function FavouritesScreen() {
  const router = useRouter();
  const { setSourceStation, setDestinationStation } = useRoute();
  const { savedJourneys, removeSavedJourney, setCurrentJourney } = useJourney();

  const handleDeleteJourney = (journeyId: string) => {
    Alert.alert(
      'Delete Journey',
      'Are you sure you want to remove this favourite journey?',
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

    console.log('Using journey from favourites:', journey);
    // Navigate to home screen where the stations will be displayed
    router.push('/');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Header />
      <JourneysList
        journeys={savedJourneys}
        title="Favourite Journeys"
        icon="heart"
        emptyStateTitle="No Favourite Journeys"
        emptyStateText="Save your frequently used journeys to access them quickly here."
        onUseJourney={handleUseJourney}
        onDeleteJourney={handleDeleteJourney}
        showActions={true}
      />
    </div>
  );
}
