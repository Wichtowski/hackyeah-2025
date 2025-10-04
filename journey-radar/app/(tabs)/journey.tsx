import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Journey, Route, Station, Incident } from '@/types/journey';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const sampleJourney: Journey = {
  id: '1',
  distance: 250000,
  duration: 14400,
  routes: [
    {
      id: '1',
      communicationMethod: 'train',
      duration: 7200,
      stations: [
        {
          id: '1',
          name: 'Kraków Łagiewniki',
        },
        {
          id: '2',
          name: 'Warszawa Centralna',
        },
        {
          id: '3',
          name: 'Warszawa Powiśle',
        },
        {
          id: '4',
          name: 'Warszawa Powion',
        }
      ],
      delay: {
          time: 100,
          description: 'Małe opóźnienia zgłoszone'
       },
      incidents: [
        {
          id: '1',
          stationId: '3',
          position: { longitude: 21.0122, latitude: 52.2297 },
          description: 'Awaria/problem zgłoszony',
          severity: 'high',
          type: 'cancelled'
        }
      ]
    },
    {
      id: '2',
      communicationMethod: 'bus',
      duration: 7200,
      stations: [
        {
          id: '5',
          name: 'Warszawa Powion',
        },
        {
          id: '6',
          name: 'Warszawa Stadion',
        },
        {
          id: '7',
          name: 'Praga Południe',
        }
      ],
      delay: {
        time: 300,
        description: 'Małe opóźnienia zgłoszony'
      },
      incidents: []
    }
  ]
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

  const lastRouteStationName = sampleJourney.routes[sampleJourney.routes.length - 1].stations[sampleJourney.routes[sampleJourney.routes.length - 1].stations.length - 1].name;
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitle}>
              <Text style={[styles.mainTitle, { color: colors.text }]}>
                {sampleJourney.title || `Aktywna trasa do ${lastRouteStationName}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.treeContainer}>
          <View style={[styles.continuousLine, { backgroundColor: colors.blue }]} />
          {sampleJourney.routes.map((route, index) => (
            <RouteSection
              key={route.id}
              route={route}
              isLast={index === sampleJourney.routes.length - 1}
              colors={colors}
            />
          ))}
        </View>

        <TouchableOpacity style={[styles.reportButton, { backgroundColor: colors.pink }]}>
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.reportButtonText}>Zgłoś problem</Text>
        </TouchableOpacity>
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
    marginLeft: 16,
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
  routeNode: {
    position: 'relative',
    marginBottom: 8,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  centerStatusDot: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  statusDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  rightStatusSection: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 16,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  centerDot: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  stationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: 'white',
  },
  stationInfo: {
    alignItems: 'flex-end',
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'right',
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  eta: {
    fontSize: 12,
    marginLeft: 4,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 16,
  },
  statusText: {
    fontSize: 12,
    textAlign: 'left',
    maxWidth: 130,
    marginLeft: 12,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodLine: {
    width: 40,
    height: 3,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  routeTransition: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
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
  reportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});