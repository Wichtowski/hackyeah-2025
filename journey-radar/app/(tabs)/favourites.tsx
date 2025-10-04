import React from 'react';
import { Alert, View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRoute } from '@/contexts/RouteContext';
import { useJourney } from '@/contexts/JourneyContext';
import { Journey } from '@/types/journey';
import { Station } from '@/types/station';
import { JourneysList } from '@/components/journeys-list';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function FavouritesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { setSourceStation, setDestinationStation } = useRoute();
  const { savedJourneys, removeSavedJourney, setCurrentJourney } = useJourney();

  const handleDeleteJourney = (journeyId: string) => {
    Alert.alert(
      'Usuń podróż',
      'Potwierdasz, że chcesz usunąć tę podróż?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => {
            removeSavedJourney(journeyId);
          }
        }
      ]
    );
  };

  const handleUseJourney = (journey: Journey) => {
    // Extract stations from journey routes - get first station of first route and last station of last route
    const firstRoute = journey.routes[0];
    const lastRoute = journey.routes[journey.routes.length - 1];

    if (!firstRoute || !lastRoute) {
      console.error('Journey has no routes');
      return;
    }

    const firstStation = firstRoute.stations[0];
    const lastStation = lastRoute.stations[lastRoute.stations.length - 1];

    if (!firstStation || !lastStation) {
      console.error('Journey routes have no stations');
      return;
    }

    // Create station objects from the journey data (convert from journey Station to app Station)
    const sourceStation: Station = {
      id: firstStation.id,
      name: firstStation.name,
      coordinates: {
        latitude: firstStation.position?.latitude || 52.2297,
        longitude: firstStation.position?.longitude || 21.0122
      },
      type: firstRoute.communicationMethod === 'train' ? 'train' : 'bus'
    };

    const destinationStation: Station = {
      id: lastStation.id,
      name: lastStation.name,
      coordinates: {
        latitude: lastStation.position?.latitude || 52.2319,
        longitude: lastStation.position?.longitude || 21.0067
      },
      type: lastRoute.communicationMethod === 'train' ? 'train' : 'bus'
    };

    // Set the stations in the route context
    setSourceStation(sourceStation);
    setDestinationStation(destinationStation);

    // Set as current journey
    setCurrentJourney(journey);

    console.log('Using journey from favourites:', journey);
    // Navigate to home screen where the stations will be displayed
    router.push('/journey');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitle}>
              <Text style={[styles.mainTitle, { color: colors.text }]}>
                Journey Radar
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.journeysContainer}>
          <JourneysList
            journeys={savedJourneys}
            title="Ulubione Podróże"
            icon="heart"
            emptyStateTitle="Brak ulubionych podróży"
            emptyStateText="Zapisz swoje często używane podróże tutaj."
            onUseJourney={handleUseJourney}
            onDeleteJourney={handleDeleteJourney}
            showActions={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
  },
  communityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  communityText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  journeysContainer: {
    flex: 1,
  },
});
