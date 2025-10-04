import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/theme';
import { Journey, RouteStatus, CommunicationMethod } from '@/types/journey';

interface JourneyCardProps {
  journey: Journey;
  onUseJourney?: (journey: Journey) => void;
  onDeleteJourney?: (journeyId: string) => void;
  showActions?: boolean;
  compact?: boolean;
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

const getStatusColor = (status: RouteStatus) => {
  switch (status) {
    case 'delay':
      return Colors.light.yellow;
    case 'problem':
      return Colors.light.pink;
    case 'cancelled':
      return '#ff4444';
    default:
      return Colors.light.green;
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
};

export const JourneyCard: React.FC<JourneyCardProps> = ({
  journey,
  onUseJourney,
  onDeleteJourney,
  showActions = true,
  compact = false,
}) => {
  // Get the first and last stations from the route segments
  const firstSegment = journey.routes[0];
  const lastSegment = journey.routes[journey.routes.length - 1];

  // Determine overall status (worst status in the journey)
  const overallStatus = journey.routes.reduce((worst, segment) => {
    if (segment.status === 'cancelled') return 'cancelled';
    if (segment.status === 'problem' && worst !== 'cancelled') return 'problem';
    if (segment.status === 'delay' && worst !== 'cancelled' && worst !== 'problem') return 'delay';
    return worst;
  }, 'on-time' as RouteStatus);

  return (
    <View style={[styles.journeyCard, compact && styles.compactCard]}>
      <View style={styles.journeyHeader}>
        <Text style={[styles.journeyTitle, compact && styles.compactTitle]}>
          {journey.title}
        </Text>
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(overallStatus) }]} />
        </View>
      </View>

      <View style={styles.routeDetails}>
        <View style={styles.stationContainer}>
          <View style={styles.stationInfo}>
            <Ionicons
              name={getCommunicationMethodIcon(firstSegment.communicationMethod)}
              size={compact ? 14 : 16}
              color={Colors.light.blue}
            />
            <Text style={[styles.stationName, compact && styles.compactStationName]}>
              {firstSegment.from}
            </Text>
          </View>
          <Text style={[styles.stationLabel, compact && styles.compactLabel]}>From</Text>
        </View>

        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={compact ? 16 : 20} color={Colors.light.icon} />
        </View>

        <View style={styles.stationContainer}>
          <View style={styles.stationInfo}>
            <Ionicons
              name={getCommunicationMethodIcon(lastSegment.communicationMethod)}
              size={compact ? 14 : 16}
              color={Colors.light.blue}
            />
            <Text style={[styles.stationName, compact && styles.compactStationName]}>
              {lastSegment.to}
            </Text>
          </View>
          <Text style={[styles.stationLabel, compact && styles.compactLabel]}>To</Text>
        </View>
      </View>

      <View style={styles.journeyMeta}>
        {journey.totalDuration && (
          <Text style={styles.durationText}>
            Duration: {journey.totalDuration}
          </Text>
        )}
        {journey.lastUpdated && !compact && (
          <Text style={styles.lastUpdatedText}>
            Last updated: {formatDate(journey.lastUpdated)}
          </Text>
        )}
      </View>

      {showActions && (
        <View style={[styles.actionButtons, compact && styles.compactActions]}>
          {onUseJourney && (
            <TouchableOpacity
              onPress={() => onUseJourney(journey)}
              style={[styles.useButton, compact && styles.compactUseButton]}
            >
              <Ionicons name="play" size={compact ? 14 : 16} color="#fff" />
              <Text style={[styles.useButtonText, compact && styles.compactButtonText]}>
                Use Journey
              </Text>
            </TouchableOpacity>
          )}

          {onDeleteJourney && (
            <TouchableOpacity
              onPress={() => onDeleteJourney(journey.id)}
              style={[styles.deleteButton, compact && styles.compactDeleteButton]}
            >
              <Ionicons name="trash-outline" size={compact ? 14 : 16} color={Colors.light.icon} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  journeyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  compactCard: {
    padding: 12,
    borderRadius: 8,
  },
  journeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  journeyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
  },
  compactTitle: {
    fontSize: 14,
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
    color: Colors.light.text,
    marginLeft: 8,
    flex: 1,
  },
  compactStationName: {
    fontSize: 12,
    marginLeft: 6,
  },
  stationLabel: {
    fontSize: 12,
    color: Colors.light.icon,
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
    color: Colors.light.icon,
    marginBottom: 2,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  compactActions: {
    paddingTop: 8,
    marginBottom: 0,
  },
  useButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.blue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
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
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  compactButtonText: {
    fontSize: 12,
    marginLeft: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  compactDeleteButton: {
    padding: 6,
  },
});
