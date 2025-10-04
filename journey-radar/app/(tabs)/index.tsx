import { Alert, View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StationInput } from '@/components/station-input';
import { useRoute } from '@/contexts/RouteContext';
import { useJourney } from '@/contexts/JourneyContext';
import { Journey, Station } from '@/types/journey';
import { JourneysList } from '@/components/journeys-list';
import { useRouter } from "expo-router";
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
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

    // Set the stations in the route context (now using journey Station type directly)
    setSourceStation(firstStation);
    setDestinationStation(lastStation);

    // Set as current journey
    setCurrentJourney(journey);

    console.log('Using journey:', journey);
    router.push('/journey');
  };

  // Get last used journeys sorted by most recent
  const lastUsedJourneys = getLastUsedJourneys();

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

        <View style={styles.stationInputContainer}>
          <StationInput
            onSourceChange={handleSourceChange}
            onDestinationChange={handleDestinationChange}
            sourceStation={sourceStation}
            destinationStation={destinationStation}
            absolutePosition={false}
          />
        </View>

        <View style={styles.journeysContainer}>
          <JourneysList
            journeys={lastUsedJourneys}
            title="Ostatnie Podróże"
            maxItems={1}
            icon="time"
            emptyStateTitle="Brak ostatnich podróży"
            emptyStateText="Twoje ostatnie podróże pojawią się tutaj."
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
  stationInputContainer: {
    zIndex: 2000,
    marginBottom: 20,
  },
  journeysContainer: {
    flex: 1,
    zIndex: 1000,
  },
  apiButtonContainer: {
    position: 'absolute',
    bottom: 100,
    right: 100,
    zIndex: 1000,
  },
});
