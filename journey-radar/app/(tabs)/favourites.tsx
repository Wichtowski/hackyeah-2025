import React from 'react';
import { Alert, View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRoute } from '@/contexts/RouteContext';
import { useJourney } from '@/contexts/JourneyContext';
import { Journey } from '@/types/journey';
import { JourneysList } from '@/components/journeys-list';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function FavouritesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { setSourceStation, setDestinationStation } = useRoute();
  const { favoriteJourneys, removeFavoriteJourney, setCurrentJourney } = useJourney();

  const handleDeleteJourney = (journeyId: string) => {
    Alert.alert(
      'Usuń z ulubionych',
      'Potwierdasz, że chcesz usunąć tę podróż z ulubionych?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => {
            removeFavoriteJourney(journeyId);
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

    console.log('Using journey from favourites:', journey);
    // Navigate to journey screen
    router.push('/journey');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitle}>
              <Text style={[styles.mainTitle, { color: colors.text }]}>Journey Radar</Text>
            </View>
          </View>
        </View>

        <View style={styles.journeysWrapper}>
          <JourneysList
            journeys={favoriteJourneys}
            title="Ulubione Podróże"
            icon="heart"
            emptyStateTitle="Brak ulubionych podróży"
            emptyStateText="Dodaj podróże do ulubionych, aby szybko je odnaleźć."
            onUseJourney={handleUseJourney}
            onDeleteJourney={handleDeleteJourney}
            showActions={true}
            colorsOverride={colors}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  header: { paddingTop: 10 },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start' },
  headerTitle: { flex: 1, marginLeft: 16 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', lineHeight: 32, textAlign: 'center' },
  journeysWrapper: { flex: 1, paddingTop: 4 },
});
