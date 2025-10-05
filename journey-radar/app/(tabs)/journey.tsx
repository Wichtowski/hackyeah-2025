import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Route, Station, Incident, Journey as AppJourney, CommunicationMethod } from '@/types/journey';
import { useJourney } from '@/contexts/JourneyContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import IncidentReportForm from '@/components/incident-report-form';
import { useRouter } from 'expo-router';
import { useRoute } from '@/contexts/RouteContext';
import { apiClient, type Journey as SdkJourney, type IncidentType } from '@journey-radar/sdk';

// Transform SDK Journey to App Journey
const transformSdkJourneyToAppJourney = (
  sdkJourney: SdkJourney,
  sourceStation: Station,
  destinationStation: Station
): AppJourney => {
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

// Map severity to IncidentType enum
const mapSeverityToIncidentType = (severity: string): IncidentType => {
  switch (severity) {
    case 'low':
      return 'ISSUES' as IncidentType;
    case 'medium':
      return 'DELAY' as IncidentType;
    case 'severe':
      return 'SEVERE_BLOCKER' as IncidentType;
    default:
      return 'ISSUES' as IncidentType;
  }
};

const getIncidentIcon = (type: string): keyof typeof MaterialIcons.glyphMap => {
  switch (type) {
    case 'delay':
      return 'schedule';
    case 'problem':
      return 'error';
    case 'cancelled':
      return 'cancel';
    default:
      return 'warning';
  }
};

const getIncidentColor = (severity: string, colors: typeof Colors.light): string => {
  switch (severity) {
    case 'small':
      return colors.yellow;
    case 'medium':
      return colors.yellow;
    case 'high':
      return colors.pink;
    default:
      return colors.yellow;
  }
};

const getCommunicationMethodIcon = (method: string): keyof typeof MaterialIcons.glyphMap => {
  switch (method) {
    case 'bus':
      return 'directions-bus';
    case 'train':
      return 'train';
    case 'tram':
      return 'subway';
    case 'metro':
      return 'subway';
    case 'walk':
      return 'directions-walk';
    default:
      return 'directions-transit';
  }
};

const StationNode: React.FC<{
  station: Station;
  delay?: { time: number; description?: string };
  colors: typeof Colors.light;
  onPress?: () => void;
}> = ({ station, delay, colors, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.routeRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.leftSection}>
        <View style={styles.stationInfo}>
          <Text style={[styles.stationName, { color: colors.text }] as any}>
            {station.name}
          </Text>
          {delay && (
            <View style={styles.etaContainer}>
              <MaterialIcons name="schedule" size={14} color={colors.yellow} />
              <Text style={[styles.eta, { color: colors.yellow }] as any}>
                +{Math.floor(delay.time / 60)} min
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.centerDot}>
        <View style={[styles.stationDot, { backgroundColor: colors.blue }]} />
      </View>

      <View style={styles.rightSection}>
        {onPress && (
          <MaterialIcons name="map" size={16} color={colors.blue} style={{ opacity: 0.6 } as any} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const IncidentNode: React.FC<{
  incident: Incident;
  colors: typeof Colors.light;
}> = ({ incident, colors }) => {
  const incidentColor = getIncidentColor(incident.severity, colors);
  const incidentIcon = getIncidentIcon(incident.type);

  return (
    <View style={styles.statusIndicatorRow}>
      <View style={styles.leftSection} />
      <View style={styles.centerStatusDot}>
        <View style={[styles.statusDot, { backgroundColor: incidentColor }]}>
          <MaterialIcons name={incidentIcon} size={16} color="white" />
        </View>
      </View>
      <View style={styles.rightStatusSection}>
        <Text style={[styles.statusText, { color: colors.text }] as any}>
          {incident.description}
        </Text>
      </View>
    </View>
  );
};

const RouteSection: React.FC<{
  route: Route;
  isLast: boolean;
  colors: typeof Colors.light;
  onStationPress?: (station: Station) => void;
}> = ({ route, isLast, colors, onStationPress }) => {
  const methodIcon = getCommunicationMethodIcon(route.communicationMethod);

  return (
    <View style={styles.routeNode}>
      {route.stations.map((station, index) => {
        const stationIncidents = route.incidents.filter(
          incident => incident.stationId === station.id
        );

        const hasIncidentBefore = route.stations.slice(0, index).some((prevStation) =>
          route.incidents.some((incident) => incident.stationId === prevStation.id)
        );

        return (
          <View key={station.id}>
            <StationNode
              station={station}
              delay={hasIncidentBefore ? route.delay : undefined}
              colors={colors}
              onPress={() => onStationPress?.(station)}
            />
            {index < route.stations.length - 1 && stationIncidents.length > 0 && (
              stationIncidents.map(incident => (
                <React.Fragment key={incident.id}>
                  <IncidentNode incident={incident} colors={colors} />
                </React.Fragment>
              ))
            )}
          </View>
        );
      })}

      {!isLast && (
        <View style={styles.routeTransition}>
          <View style={styles.leftSection} />
          <View style={styles.centerDot}>
            <View style={[styles.transitionIcon, { backgroundColor: colors.blue }]}>
              <MaterialIcons name={methodIcon} size={20} color="white" />
            </View>
          </View>
          <View style={styles.rightSection} />
        </View>
      )}
    </View>
  );
};

export default function JourneyScreen(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [isSubmittingIncident, setIsSubmittingIncident] = useState(false);
  const [showIncidentConfirmModal, setShowIncidentConfirmModal] = useState(false);
  const [incidentConfirmMessage, setIncidentConfirmMessage] = useState<string | null>(null);
  const [showIncidentThanksModal, setShowIncidentThanksModal] = useState(false);
  const [incidentPromptEnabled, setIncidentPromptEnabled] = useState(false); // feature flag (disabled by default)
  const { currentJourney, savedJourneys, setCurrentJourney, addFavoriteJourney, removeFavoriteJourney, isFavorite } = useJourney();
  const { setSelectedMapStation, sourceStation, destinationStation } = useRoute();
  const router = useRouter();

  // Use current journey if available, otherwise use the first saved journey as fallback
  const journey = currentJourney || savedJourneys[0];

  const isJourneyFavorite = journey ? isFavorite(journey.id) : false;

  const handleStationPress = (station: Station) => {
    console.log('Station pressed:', station);

    // If station doesn't have position, add mock coordinates based on station name hash
    // This is temporary until we get real coordinates from the backend
    let stationWithPosition = station;
    if (!station.position) {
      // Generate consistent but different coordinates for each station
      const hash = station.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const lat = 50.05936 + (hash % 100) / 1000; // Kraków area
      const lng = 19.93435 + ((hash * 7) % 100) / 1000;

      stationWithPosition = {
        ...station,
        position: {
          latitude: lat,
          longitude: lng,
        }
      };

      console.log('Added mock position for station:', station.name, stationWithPosition.position);
    }

    setSelectedMapStation(stationWithPosition);
    router.push('/map');
  };

  const handleToggleFavorite = () => {
    if (!journey) return;

    if (isJourneyFavorite) {
      removeFavoriteJourney(journey.id);
    } else {
      addFavoriteJourney(journey);
    }
  };

  // Trigger random incident confirmation modal after 3 seconds
  useEffect(() => {
    if (!journey || !incidentPromptEnabled) return; // guard by feature flag
    const timer = setTimeout(() => {
      try {
        const allStations = journey.routes.flatMap(r => r.stations);
        if (allStations.length > 0) {
          const randomStation = allStations[Math.floor(Math.random() * allStations.length)];
          setIncidentConfirmMessage(`Wykryto incydent w pobliżu stacji ${randomStation.name}. Czy potwierdzasz?`);
        } else {
          setIncidentConfirmMessage('Wykryto incydent na trasie. Czy potwierdzasz?');
        }
      } catch {
        setIncidentConfirmMessage('Wykryto incydent na trasie. Czy potwierdzasz?');
      }
      setShowIncidentConfirmModal(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [journey, incidentPromptEnabled]);

  const closeIncidentQuestionModal = () => {
    setShowIncidentConfirmModal(false);
  };

  const handleIncidentConfirmation = (confirmed: boolean) => {
    console.log('User incident confirmation answer:', confirmed);
    // Open thanks modal immediately, then close question modal to keep backdrop without flicker
    setShowIncidentThanksModal(true);
    setShowIncidentConfirmModal(false);
  };

  // Auto close thanks modal
  useEffect(() => {
    if (showIncidentThanksModal) {
      const t = setTimeout(() => setShowIncidentThanksModal(false), 1500);
      return () => clearTimeout(t);
    }
  }, [showIncidentThanksModal]);

  // If no journey is available, show a message
  if (!journey) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyState}>
          <MaterialIcons name="route" size={48} color={colors.icon} />
          <Text style={[styles.emptyStateTitle, { color: colors.text }] as any}>
            Nie wybrano podróży
          </Text>
          <Text style={[styles.emptyStateText, { color: colors.icon }] as any}>
            Wybierz podróż z ulubionych lub ekranu głównego.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const lastRouteStationName = journey.routes[journey.routes.length - 1].stations[journey.routes[journey.routes.length - 1].stations.length - 1].name;
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitle}>
              <Text style={[styles.mainTitle, { color: colors.text }] as any}>
                {journey.title || `Aktywna trasa do ${lastRouteStationName}`}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.favoriteButton, { backgroundColor: colors.background }]}
              onPress={handleToggleFavorite}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={isJourneyFavorite ? "favorite" : "favorite-border"}
                size={24}
                color={isJourneyFavorite ? colors.pink : colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.treeContainer}>
          <View style={[styles.continuousLine, { backgroundColor: colors.blue }]} />
          {journey.routes.map((route, index) => (
            <View key={route.id}>
              <RouteSection
                route={route}
                isLast={index === journey.routes.length - 1}
                colors={colors}
                onStationPress={handleStationPress}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.reportButton, { backgroundColor: colors.pink }]}
          onPress={() => setShowIncidentForm(true)}
          activeOpacity={0.85}
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.reportButtonText as any}>Zgłoś problem</Text>
        </TouchableOpacity>
      </ScrollView>

      <IncidentReportForm
        visible={showIncidentForm}
        onClose={() => setShowIncidentForm(false)}
        journey={journey}
        onSubmit={async (payload) => {
          if (isSubmittingIncident) return;

          setIsSubmittingIncident(true);
          try {
            console.log('Submitting incident:', payload);

            // Map severity to IncidentType
            const incidentType = mapSeverityToIncidentType(payload.severity);

            // Submit incident to backend
            await apiClient.reportIncident({
              userId: 'user_1', // TODO: Replace with actual user ID from auth context
              incidentType,
              description: payload.details,
            });

            console.log('Incident submitted successfully');

            // Reload journey to get updated incident data
            if (sourceStation && destinationStation) {
              console.log('Reloading journey...');

              const sdkJourney = await apiClient.getJourney(
                { station: { name: sourceStation.name } },
                { station: { name: destinationStation.name } }
              );

              // Transform and update current journey
              const updatedJourney = transformSdkJourneyToAppJourney(
                sdkJourney,
                sourceStation,
                destinationStation
              );

              setCurrentJourney(updatedJourney);
              console.log('Journey reloaded with new incidents');
            } else {
              console.warn('Cannot reload journey: source or destination station not available');
            }

            setShowIncidentForm(false);
          } catch (error) {
            console.error('Error submitting incident:', error);
            Alert.alert(
              'Błąd',
              'Nie udało się zgłosić incydentu. Spróbuj ponownie.',
              [{ text: 'OK' }]
            );
          } finally {
            setIsSubmittingIncident(false);
          }
        }}
      />

      <Modal
        visible={incidentPromptEnabled && showIncidentConfirmModal}
        transparent
        animationType="slide"
        onRequestClose={closeIncidentQuestionModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.incidentModalContainer,
            {
              backgroundColor: colors.background,
              borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
              minHeight: Dimensions.get('window').height * 0.25,
            }
          ]}>
            <Text style={[styles.incidentModalTitle, { color: colors.text }] as any}>Incydent</Text>
            <Text style={[styles.incidentModalMessage, { color: colors.text }] as any}>
              {incidentConfirmMessage || 'Wykryto incydent na trasie. Czy potwierdzasz?'}
            </Text>
            <View style={styles.incidentModalButtons}>
              <TouchableOpacity
                style={[styles.incidentModalButton, { backgroundColor: colors.blue }]}
                onPress={() => handleIncidentConfirmation(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.incidentModalButtonText as any}>Nie</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.incidentModalButton, { backgroundColor: colors.pink }]}
                onPress={() => handleIncidentConfirmation(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.incidentModalButtonText as any}>Tak</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={incidentPromptEnabled && showIncidentThanksModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowIncidentThanksModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.incidentModalContainer,
            styles.incidentThanksModal,
            {
              backgroundColor: colors.background,
              borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
              minHeight: Dimensions.get('window').height * 0.22,
              justifyContent: 'center'
            }
          ]}>
            <View style={styles.incidentThanksContainer}>
              <MaterialIcons name="check-circle" size={48} color={colors.pink} />
              <Text style={[styles.incidentThanksText, { color: colors.text }] as any}>Dziękujemy za informację!</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: { padding: 20, paddingTop: 10 },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerTitle: { flex: 1, marginLeft: 16 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', lineHeight: 32 },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
    marginTop: 4,
  },
  treeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    position: 'relative',
  },
  continuousLine: {
    position: 'absolute',
    left: '50%',
    marginLeft: -2,
    top: 20,
    bottom: 20,
    width: 4,
  },
  routeNode: { position: 'relative', marginBottom: 8 },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  statusIndicatorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  centerStatusDot: { alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  statusDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  rightStatusSection: { flex: 1, alignItems: 'flex-start', paddingLeft: 16 },
  leftSection: { flex: 1, alignItems: 'flex-end', paddingRight: 16 },
  centerDot: { alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  stationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: 'white',
  },
  stationInfo: { alignItems: 'flex-end' },
  stationName: { fontSize: 16, fontWeight: '600', marginBottom: 2, textAlign: 'right' },
  etaContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  eta: { fontSize: 12, marginLeft: 4 },
  rightSection: { flex: 1, alignItems: 'flex-start', paddingLeft: 16 },
  statusText: { fontSize: 12, textAlign: 'left', maxWidth: 130, marginLeft: 12 },
  routeTransition: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  transitionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  reportButtonText: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  incidentModalContainer: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    borderWidth: StyleSheet.hairlineWidth,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  incidentModalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  incidentModalMessage: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  incidentModalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  incidentModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  incidentModalButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  incidentThanksContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  incidentThanksText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  incidentThanksModal: {
    paddingTop: 32,
    paddingBottom: 40,
  },
});
