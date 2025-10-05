import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Journey, CommunicationMethod } from '@/types/journey';

interface JourneyCardProps {
  journey: Journey;
  onUseJourney?: (journey: Journey) => void;
  onDeleteJourney?: (journeyId: string) => void;
  showActions?: boolean;
  compact?: boolean;
  colorsOverride?: typeof Colors.light;
}

const getCommunicationMethodIcon = (method: CommunicationMethod): "bus" | "train" | "car-sport" | "walk" => {
  switch (method) {
    case 'bus':
      return 'bus';
    case 'train':
      return 'train';
    case 'tram':
      return 'car-sport';
    case 'walk':
      return 'walk';
    default:
      return 'bus';
  }
};

const getOverallStatus = (journey: Journey): 'on-time' | 'delay' | 'problem' => {
  for (const route of journey.routes) {
    if (route.incidents.length > 0) {
      const hasHighSeverity = route.incidents.some(incident => incident.severity === 'high');
      if (hasHighSeverity) return 'problem';
    }
    if (route.delay.time > 0) return 'delay';
  }
  return 'on-time';
};

const getStatusColor = (status: 'on-time' | 'delay' | 'problem', themeColors: typeof Colors.light) => {
  switch (status) {
    case 'delay':
      return themeColors.yellow;
    case 'problem':
      return themeColors.pink;
    default:
      return themeColors.green;
  }
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

export const JourneyCard: React.FC<JourneyCardProps> = ({
  journey,
  onUseJourney,
  onDeleteJourney,
  showActions = true,
  compact = false,
  colorsOverride,
}) => {
  const themeColors = colorsOverride || Colors.light;

  // Safety check for journey structure
  if (!journey || !journey.routes || journey.routes.length === 0) {
    console.warn('JourneyCard: Invalid journey data', journey);
    return null;
  }

  const firstRoute = journey.routes[0];
  const lastRoute = journey.routes[journey.routes.length - 1];

  if (!firstRoute || !firstRoute.stations || firstRoute.stations.length === 0) {
    console.warn('JourneyCard: First route has no stations', firstRoute);
    return null;
  }

  if (!lastRoute || !lastRoute.stations || lastRoute.stations.length === 0) {
    console.warn('JourneyCard: Last route has no stations', lastRoute);
    return null;
  }

  const firstStation = firstRoute.stations[0];
  const lastStation = lastRoute.stations[lastRoute.stations.length - 1];

  if (!firstStation || !lastStation) {
    console.warn('JourneyCard: Missing station data', { firstStation, lastStation });
    return null;
  }

  const overallStatus = getOverallStatus(journey);

  return (
    <View style={[styles.journeyCard, compact && styles.compactCard, { backgroundColor: themeColors.background, borderColor: themeColors.blue + '22' }]}>
      <View style={styles.journeyHeader}>
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(overallStatus, themeColors) }]} />
        </View>
      </View>

      <View style={styles.routeDetails}>
        <View style={styles.stationContainer}>
          <View style={styles.stationInfo}>
            <Ionicons
              name={getCommunicationMethodIcon(firstRoute.communicationMethod)}
              size={compact ? 14 : 16}
              color={themeColors.blue}
            />
            <Text style={[styles.stationName, compact && styles.compactStationName, { color: themeColors.text }]}>
              {firstStation.name}
            </Text>
          </View>
          <Text style={[styles.stationLabel, compact && styles.compactLabel, { color: themeColors.icon }]}>Od</Text>
        </View>

        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={compact ? 16 : 20} color={themeColors.icon} />
        </View>

        <View style={styles.stationContainer}>
          <View style={styles.stationInfo}>
            <Ionicons
              name={getCommunicationMethodIcon(lastRoute.communicationMethod)}
              size={compact ? 14 : 16}
              color={themeColors.blue}
            />
            <Text style={[styles.stationName, compact && styles.compactStationName, { color: themeColors.text }]}>
              {lastStation.name}
            </Text>
          </View>
          <Text style={[styles.stationLabel, compact && styles.compactLabel, { color: themeColors.icon }]}>Do</Text>
        </View>
      </View>

      <View style={styles.journeyMeta}>
        {journey.duration && (
          <Text style={[styles.durationText, { color: themeColors.icon }]}>Czas trwania: {formatDuration(journey.duration)}</Text>
        )}
        {overallStatus === 'delay' && (
          <Text style={{ fontSize: 12, color: themeColors.yellow, fontWeight: '500' }}>
            Zgłoszono opóźnienia
          </Text>
        )}
        {overallStatus === 'problem' && (
          <Text style={{ fontSize: 12, color: themeColors.pink, fontWeight: '500' }}>
            Zgłoszono problemy
          </Text>
        )}
      </View>

      {showActions && (
        <View style={[styles.actionButtons, compact && styles.compactActions, { borderTopColor: themeColors.blue + '22' }]}>
          {onUseJourney && (
            <TouchableOpacity
              onPress={() => onUseJourney(journey)}
              style={[styles.useButton, compact && styles.compactUseButton, { backgroundColor: themeColors.blue }]}
            >
              <Ionicons name="play" size={compact ? 14 : 16} color={themeColors.text} />
              <Text style={[styles.useButtonText, compact && styles.compactButtonText, { color: themeColors.text }]}>
                Użyj Podróży
              </Text>
            </TouchableOpacity>
          )}

          {onDeleteJourney && (
            <TouchableOpacity
              onPress={() => onDeleteJourney(journey.id)}
              style={[styles.deleteButton, compact && styles.compactDeleteButton, { backgroundColor: themeColors.blue + '11' }]}
            >
              <Ionicons name="trash-outline" size={compact ? 14 : 16} color={themeColors.icon} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  journeyCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
  },
  compactCard: {
    padding: 12,
    borderRadius: 12,
  },
  journeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    marginLeft: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stationContainer: {
    flex: 1,
  },
  stationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stationName: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  compactStationName: {
    fontSize: 12,
    marginLeft: 6,
  },
  stationLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  compactLabel: {
    fontSize: 10,
  },
  arrowContainer: {
    marginHorizontal: 16,
    alignItems: 'center',
  },
  journeyMeta: {
    marginBottom: 12,
  },
  durationText: {
    fontSize: 12,
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  compactActions: {
    paddingTop: 8,
    marginBottom: 0,
  },
  useButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  compactUseButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  useButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  compactButtonText: {
    fontSize: 12,
    marginLeft: 4,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 10,
  },
  compactDeleteButton: {
    padding: 6,
  },
});
