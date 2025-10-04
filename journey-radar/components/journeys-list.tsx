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
  maxItems?: number;
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
  maxItems,
}) => {
  // Limit journeys if maxItems is specified
  const displayedJourneys = maxItems ? journeys.slice(0, maxItems) : journeys;

  return (
    <View style={styles.wrapper}>
      {/* Fixed title header outside of ScrollView */}
      <View style={styles.titleContainer}>
        <Ionicons name={icon as any} size={24} color={Colors.light.blue} />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {displayedJourneys.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name={`${icon}-outline` as any} size={48} color={Colors.light.icon} />
            <Text style={styles.emptyStateTitle}>{emptyStateTitle}</Text>
            <Text style={styles.emptyStateText}>{emptyStateText}</Text>
          </View>
        ) : (
          <View style={styles.journeysList}>
            {displayedJourneys.map(journey => (
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginLeft: 12,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    padding: 20,
    flexGrow: 1,
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
