import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { FavouriteRoute } from '@/types/favourite';
import { Station } from '@/types/station';
import { formatDate } from '@/services/routesData';

interface RouteCardProps {
  route: FavouriteRoute;
  onUseRoute?: (route: FavouriteRoute) => void;
  onDeleteRoute?: (routeId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

const getTransportIcon = (type: Station['type']): "bus" | "train" | "car-sport" => {
  switch (type) {
    case 'bus':
      return 'bus';
    case 'train':
      return 'train';
    case 'tram':
      return 'car-sport';
    default:
      return 'bus';
  }
};

const getTransportColor = (_type: Station['type']) => {
  return Colors.light.blue; // Bus color for all since we're focusing on buses
};

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  onUseRoute,
  onDeleteRoute,
  showActions = true,
  compact = false,
}) => {
  return (
    <View style={[styles.routeCard, compact && styles.compactCard]}>
      <View style={styles.routeDetails}>
        <View style={styles.stationContainer}>
          <View style={styles.stationInfo}>
            <Ionicons
              name={getTransportIcon(route.source.type)}
              size={compact ? 14 : 16}
              color={getTransportColor(route.source.type)}
            />
            <Text style={[styles.stationName, compact && styles.compactStationName]}>
              {route.source.name}
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
              name={getTransportIcon(route.destination.type)}
              size={compact ? 14 : 16}
              color={getTransportColor(route.destination.type)}
            />
            <Text style={[styles.stationName, compact && styles.compactStationName]}>
              {route.destination.name}
            </Text>
          </View>
          <Text style={[styles.stationLabel, compact && styles.compactLabel]}>To</Text>
        </View>
      </View>

      {route.lastUsed && !compact && (
        <View style={styles.lastUsedContainer}>
          <Text style={styles.lastUsedText}>
            Last used: {formatDate(route.lastUsed)}
          </Text>
        </View>
      )}

      {showActions && (
        <View style={[styles.actionButtons, compact && styles.compactActions]}>
          {onUseRoute && (
            <TouchableOpacity
              onPress={() => onUseRoute(route)}
              style={[styles.useButton, compact && styles.compactUseButton]}
            >
              <Ionicons name="play" size={compact ? 14 : 16} color="#fff" />
              <Text style={[styles.useButtonText, compact && styles.compactButtonText]}>
                Use Route
              </Text>
            </TouchableOpacity>
          )}

          {onDeleteRoute && (
            <TouchableOpacity
              onPress={() => onDeleteRoute(route.id)}
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
  routeCard: {
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
  lastUsedContainer: {
    marginBottom: 12,
  },
  lastUsedText: {
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
