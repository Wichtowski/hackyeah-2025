import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Journey } from '@/types/journey';
import { JourneyCard } from '@/components/journey-card';

interface JourneysListProps {
  journeys: Journey[];
  title: string;
  icon: string;
  emptyStateTitle: string;
  emptyStateText: string;
  onUseJourney: (journey: Journey) => void;
  onDeleteJourney?: (journeyId: string) => void;
  showActions?: boolean;
}

export const JourneysList: React.FC<JourneysListProps> = ({
  journeys,
  title,
  icon,
  emptyStateTitle,
  emptyStateText,
  onUseJourney,
  onDeleteJourney,
  showActions = true,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Ionicons name={icon as any} size={24} color={Colors.light.blue} />
        <Text style={styles.title}>{title}</Text>
      </View>

      {journeys.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name={`${icon}-outline` as any} size={48} color={Colors.light.icon} />
          <Text style={styles.emptyStateTitle}>{emptyStateTitle}</Text>
          <Text style={styles.emptyStateText}>{emptyStateText}</Text>
        </View>
      ) : (
        <View style={styles.journeysList}>
          {journeys.map(journey => (
            <JourneyCard
              key={journey.id}
              journey={journey}
              onUseJourney={onUseJourney}
              onDeleteJourney={onDeleteJourney}
              showActions={showActions}
              compact={false}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    marginTop: 10,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginLeft: 12,
  },
  journeysList: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});
