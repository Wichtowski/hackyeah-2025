import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Journey, RouteSegment, RouteStatus } from '@/types/journey';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Sample journey data
const sampleJourney: Journey = {
  id: '1',
  title: 'Aktywna trasa do Praga Południe',
  routes: [
    {
      id: '1',
      from: 'Kraków Łagiewniki',
      to: 'Warszawa Powiśle',
      communicationMethod: 'train',
      status: 'delay',
      eta: '09:42',
      delayMinutes: 5,
      problemDescription: 'Małe opóźnienia zgłoszone'
    },
    {
      id: '2',
      from: 'Warszawa Powiśle',
      to: 'Warszawa Powion',
      communicationMethod: 'train',
      status: 'problem',
      eta: '10:15',
      problemDescription: 'Awaria/problem zgłoszony'
    },
    {
      id: '3',
      from: 'Warszawa Powion',
      to: 'Warszawa Stadion',
      communicationMethod: 'train',
      status: 'on-time',
      eta: '10:30'
    },
    {
      id: '4',
      from: 'Warszawa Stadion',
      to: 'Praga Południe',
      communicationMethod: 'bus',
      status: 'on-time',
      eta: '10:45'
    }
  ],
  totalDuration: '45 min',
  lastUpdated: new Date()
};

const getStatusIcon = (status: RouteStatus): keyof typeof MaterialIcons.glyphMap => {
  switch (status) {
    case 'delay':
      return 'schedule';
    case 'problem':
      return 'error';
    case 'cancelled':
      return 'cancel';
    default:
      return 'check-circle';
  }
};

const getStatusColor = (status: RouteStatus, colors: typeof Colors.light): string => {
  switch (status) {
    case 'delay':
      return colors.yellow;
    case 'problem':
      return colors.pink;
    case 'cancelled':
      return '#ff4444';
    default:
      return colors.green;
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

const RouteNode: React.FC<{
  route: RouteSegment;
  isLast: boolean;
  colors: typeof Colors.light;
}> = ({ route, isLast, colors }) => {
  const statusColor = getStatusColor(route.status, colors);
  const statusIcon = getStatusIcon(route.status);
  const methodIcon = getCommunicationMethodIcon(route.communicationMethod);

  return (
    <View style={styles.routeNode}>
      <View style={styles.routeContent}>
        <View style={styles.stationInfo}>
          <Text style={[styles.stationName, { color: colors.text }]}>
            {route.from}
          </Text>
          {route.eta && (
            <View style={styles.etaContainer}>
              <MaterialIcons name="schedule" size={16} color={colors.icon} />
              <Text style={[styles.eta, { color: colors.text }]}>ETA {route.eta}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.statusContainer}>
          {route.problemDescription && (
            <Text style={[styles.statusText, { color: colors.text }]}>
              {route.problemDescription}
            </Text>
          )}
        </View>

        {route.communicationMethod !== 'walk' && (
          <View style={styles.methodContainer}>
            <View style={[styles.methodLine, { backgroundColor: statusColor }]} />
            <View style={[styles.methodIcon, { backgroundColor: statusColor }]}>
              <MaterialIcons name={methodIcon} size={20} color="white" />
            </View>
          </View>
        )}
      </View>
      
      {!isLast && (
        <View style={[styles.verticalLine, { backgroundColor: colors.blue }]} />
      )}
    </View>
  );
};

export default function JourneyScreen(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
            <View style={styles.headerTitle}>
              <View style={styles.communityBadge}>
                <MaterialIcons name="train" size={16} color={colors.blue} />
                <MaterialIcons name="train" size={16} color={colors.blue} />
                <MaterialIcons name="train" size={16} color={colors.blue} />
                <Text style={[styles.communityText, { color: colors.blue }]}>
                  COMMUNITY-DRIVEN PUBLIC TRANSPORT
                </Text>
              </View>
              <Text style={[styles.mainTitle, { color: colors.text }]}>
                {sampleJourney.title}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.treeContainer}>
          {sampleJourney.routes.map((route, index) => (
            <RouteNode
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
  },
  routeNode: {
    position: 'relative',
    marginBottom: 20,
  },
  routeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stationInfo: {
    flex: 1,
    marginRight: 16,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eta: {
    fontSize: 14,
    marginLeft: 4,
    color: '#666',
  },
  statusContainer: {
    alignItems: 'flex-end',
    minWidth: 120,
  },
  statusText: {
    fontSize: 12,
    textAlign: 'right',
    maxWidth: 120,
  },
  methodContainer: {
    position: 'absolute',
    right: 10,
    top: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodLine: {
    width: 20,
    height: 2,
  },
  methodIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  verticalLine: {
    position: 'absolute',
    left: 20,
    top: 60,
    width: 2,
    height: 40,
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