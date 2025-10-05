import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Journey } from '@/types/journey';
import { JourneyCard } from '@/components/journey-card';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
  colorsOverride?: typeof Colors.light;
  compact?: boolean;
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
  colorsOverride,
  compact = false,
}) => {
  const scheme = useColorScheme();
  const themeColors = colorsOverride || Colors[scheme ?? 'light'];
  // Limit journeys if maxItems is specified
  const displayedJourneys = maxItems ? journeys.slice(0, maxItems) : journeys;

  return (
    <View style={[styles.wrapper]}>
      <View style={[styles.titleContainer, { borderBottomColor: themeColors.blue + '22' }]}>
        <Ionicons name={icon as any} size={20} color={themeColors.blue} />
        <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
      </View>

      <View style={[styles.contentContainer]}>
        {displayedJourneys.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name={`${icon}-outline` as any} size={40} color={themeColors.icon} />
            <Text style={[styles.emptyStateTitle, { color: themeColors.text }]}>{emptyStateTitle}</Text>
            <Text style={[styles.emptyStateText, { color: themeColors.icon }]}>{emptyStateText}</Text>
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
                compact={compact}
                colorsOverride={themeColors}
              />
            ))}
          </View>
        )}
      </View>
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
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  contentContainer: {
    flexGrow: 1,
    gap: 16,
  },
  journeysList: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});
