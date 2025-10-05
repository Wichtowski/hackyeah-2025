import { Alert, View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StationInput } from '@/components/station-input';
import { useRoute } from '@/contexts/RouteContext';
import { useJourney } from '@/contexts/JourneyContext';
import { Journey, Station, CommunicationMethod } from '@/types/journey';
import { JourneysList } from '@/components/journeys-list';
import { useRouter } from "expo-router";
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {Header} from '@/components/header';
import { apiClient } from '@journey-radar/sdk';
import type { Journey as SdkJourney } from '@journey-radar/sdk';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Transform SDK Journey to App Journey
const transformSdkJourneyToAppJourney = (
  sdkJourney: SdkJourney,
  sourceStation: Station,
  destinationStation: Station
): Journey => {
  const journeyId = `journey_${Date.now()}`;
  
  return {
    id: journeyId,
    title: `${sourceStation.name} → ${destinationStation.name}`,
    distance: sdkJourney.distance,
    duration: sdkJourney.durationInSeconds,
    routes: sdkJourney.routes.map((route, routeIndex) => ({
      id: `route_${journeyId}_${routeIndex}`,
      stations: route.stations.map((station, stationIndex) => ({
        id: `station_${journeyId}_${routeIndex}_${stationIndex}`,
        name: station.name,
        position: undefined,
      })),
      delay: route.delay,
      incidents: route.incidents.map((incident, incidentIndex) => ({
        id: `incident_${journeyId}_${routeIndex}_${incidentIndex}`,
        stationId: `station_${journeyId}_${routeIndex}_${route.stations.indexOf(incident.connection.from)}`,
        position: { longitude: 0, latitude: 0 }, // SDK doesn't provide position for incidents
        description: incident.type,
        severity: incident.severity,
        type: incident.type,
      })),
      communicationMethod: 'train' as CommunicationMethod, // SDK doesn't provide this, defaulting to train
      duration: sdkJourney.durationInSeconds / sdkJourney.routes.length, // Distribute duration evenly
    })),
  };
};

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { sourceStation, destinationStation, setSourceStation, setDestinationStation } = useRoute();
  const { getLastUsedJourneys, removeSavedJourney, setCurrentJourney, addSavedJourney } = useJourney();
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Animate button when both stations are filled
  useEffect(() => {
    const shouldShow = !!sourceStation && !!destinationStation;
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: shouldShow ? 1 : 0,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: shouldShow ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [sourceStation, destinationStation, slideAnim, opacityAnim]);

  // Validate that source and destination are different
  useEffect(() => {
    if (sourceStation && destinationStation && sourceStation.name === destinationStation.name) {
      setSearchError('Stacja początkowa i docelowa nie mogą być takie same');
    } else if (searchError === 'Stacja początkowa i docelowa nie mogą być takie same') {
      setSearchError(null);
    }
  }, [sourceStation, destinationStation]);

  const handleSourceChange = (station: Station | null): void => {
    setSourceStation(station);
    console.log('Source station set to:', station);
  };

  const handleDestinationChange = (station: Station | null): void => {
    setDestinationStation(station);
    console.log('Destination station set to:', station);
  };

  const handleSearch = async () => {
    if (!sourceStation || !destinationStation) {
      setSearchError('Proszę podać obie stacje');
      return;
    }

    if (sourceStation.name === destinationStation.name) {
      setSearchError('Stacja początkowa i docelowa nie mogą być takie same');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      console.log('Searching journey from', sourceStation.name, 'to', destinationStation.name);
      
      const sdkJourney = await apiClient.getJourney(
        { station: { name: sourceStation.name } },
        { station: { name: destinationStation.name } }
      );

      console.log('SDK Journey found:', sdkJourney);

      // Transform SDK journey to app journey format
      const appJourney = transformSdkJourneyToAppJourney(sdkJourney, sourceStation, destinationStation);
      console.log('Transformed to app journey:', appJourney);

      // Set as current journey and save it
      setCurrentJourney(appJourney);
      addSavedJourney(appJourney);

      // Navigate to journey screen
      router.push('/journey');
    } catch (error) {
      console.error('Error searching journey:', error);
      setSearchError('Nie udało się znaleźć połączenia. Sprawdź nazwy stacji i spróbuj ponownie.');
    } finally {
      setIsSearching(false);
    }
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitle}>
              <Text style={[styles.mainTitle, { color: colors.text }]}>Journey Radar</Text>
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.blue + '22' }]}>
          <StationInput
            onSourceChange={handleSourceChange}
            onDestinationChange={handleDestinationChange}
            sourceStation={sourceStation}
            destinationStation={destinationStation}
            absolutePosition={false}
            onFocusChange={setIsInputFocused}
          />
          
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                maxHeight: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 100],
                }),
                opacity: opacityAnim,
                overflow: 'hidden',
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.searchButton,
                {
                  backgroundColor: colors.green,
                  opacity: (isSearching || (sourceStation && destinationStation && sourceStation.name === destinationStation.name)) ? 0.5 : 1,
                },
              ]}
              onPress={handleSearch}
              disabled={!sourceStation || !destinationStation || isSearching || (sourceStation && destinationStation && sourceStation.name === destinationStation.name)}
              activeOpacity={0.85}
            >
              {isSearching ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Ionicons name="search" size={20} color="white" />
              )}
              <Text style={styles.searchButtonText}>
                {isSearching ? 'Szukam...' : 'Szukaj połączenia'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {searchError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={colors.pink} />
              <Text style={[styles.errorText, { color: colors.pink }]}>{searchError}</Text>
            </View>
          )}
        </View>

        {!isInputFocused && (
          <View style={styles.journeysWrapper}>
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
              colorsOverride={colors}
            />
          </View>
        )}

        {isInputFocused && (
          <View style={styles.journeysWrapper}>
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
              colorsOverride={colors}
            />
          </View>
        )}
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
  sectionCard: { borderWidth: 1, borderRadius: 16, padding: 16 },
  journeysWrapper: { flex: 1, paddingTop: 4 },
  buttonContainer: {
    width: '100%',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fee',
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
});
