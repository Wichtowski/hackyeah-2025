import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Route, Station, Incident } from '@/types/journey';
import { useJourney } from '@/contexts/JourneyContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import IncidentReportForm from '@/components/incident-report-form';

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
      return 'tram';
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
}> = ({ station, delay, colors }) => {
  return (
    <View style={styles.routeRow}>
      <View style={styles.leftSection}>
        <View style={styles.stationInfo}>
          <Text style={[styles.stationName, { color: colors.text }]}>
            {station.name}
          </Text>
          {delay && (
            <View style={styles.etaContainer}>
              <MaterialIcons name="schedule" size={14} color={colors.yellow} />
              <Text style={[styles.eta, { color: colors.yellow }]}>
                +{Math.floor(delay.time / 60)} min
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.centerDot}>
        <View style={[styles.stationDot, { backgroundColor: colors.blue }]} />
      </View>

      <View style={styles.rightSection} />
    </View>
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
        <Text style={[styles.statusText, { color: colors.text }]}>
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
}> = ({ route, isLast, colors }) => {
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
            />
            {index < route.stations.length - 1 && stationIncidents.length > 0 && (
              stationIncidents.map(incident => (
                <IncidentNode key={incident.id} incident={incident} colors={colors} />
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
  const { currentJourney, savedJourneys } = useJourney();

  // Use current journey if available, otherwise use the first saved journey as fallback
  const journey = currentJourney || savedJourneys[0];

  // If no journey is available, show a message
  if (!journey) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyState}>
          <MaterialIcons name="route" size={48} color={colors.icon} />
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
            Nie wybrano podróży
          </Text>
          <Text style={[styles.emptyStateText, { color: colors.icon }]}>
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
              <Text style={[styles.mainTitle, { color: colors.text }]}>
                {journey.title || `Aktywna trasa do ${lastRouteStationName}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.treeContainer}>
          <View style={[styles.continuousLine, { backgroundColor: colors.blue }]} />
          {journey.routes.map((route, index) => (
            <RouteSection
              key={route.id}
              route={route}
              isLast={index === journey.routes.length - 1}
              colors={colors}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.reportButton, { backgroundColor: colors.pink }]}
          onPress={() => setShowIncidentForm(true)}
          activeOpacity={0.85}
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.reportButtonText}>Zgłoś problem</Text>
        </TouchableOpacity>
      </ScrollView>

      <IncidentReportForm
        visible={showIncidentForm}
        onClose={() => setShowIncidentForm(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: { padding: 20, paddingTop: 10 },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start' },
  headerTitle: { flex: 1, marginLeft: 16 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', lineHeight: 32 },
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
});

