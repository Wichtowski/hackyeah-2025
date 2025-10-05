import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { SEVERITY_OPTIONS } from '@/types/incident-severity';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Journey, Route } from '@/types/journey';
import { apiClient } from '@journey-radar/sdk';

interface RouteSegment {
  routeId: string;
  fromStation: string;
  toStation: string;
  label: string;
  stationIndex: number;
  routeIndex: number;
}

interface IncidentReportFormProps {
  visible?: boolean;
  onClose: () => void;
  journey?: Journey | null;
  onSubmit?: (payload: { 
    severity: string; 
    details: string; 
    routeSegment?: RouteSegment;
  }) => void;
}

const RADIUS_CONTROL = 12;
const RADIUS_CARD = 16;
const CARD_MAX_WIDTH = 420;
const AUTO_CLOSE_DELAY = 1800;

const IncidentReportForm: React.FC<IncidentReportFormProps> = ({
  visible = false,
  onClose,
  journey,
  onSubmit,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedSeverity, setSelectedSeverity] = useState(SEVERITY_OPTIONS[1].value);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Generate route segments from journey
  const routeSegments = useMemo((): RouteSegment[] => {
    if (!journey) return [];

    const segments: RouteSegment[] = [];
    
    journey.routes.forEach((route, routeIndex) => {
      for (let i = 0; i < route.stations.length - 1; i++) {
        const fromStation = route.stations[i];
        const toStation = route.stations[i + 1];
        segments.push({
          routeId: route.id,
          fromStation: fromStation.name,
          toStation: toStation.name,
          label: `${fromStation.name} → ${toStation.name}`,
          stationIndex: i,
          routeIndex,
        });
      }
    });

    return segments;
  }, [journey]);

  const severityColorMap: Record<string, string> = {
    low: colors.blue,
    medium: colors.yellow,
    severe: colors.pink,
  };

  const selectedSeverityDescription = useMemo(
    () => SEVERITY_OPTIONS.find(o => o.value === selectedSeverity)?.description,
    [selectedSeverity]
  );

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, AUTO_CLOSE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [submitted, onClose]);

  if (!visible) return null;

  const handleSelectSeverity = (severity: string) => setSelectedSeverity(severity);

  const handleSelectSegment = (index: number) => setSelectedSegmentIndex(index);

  const handleDetectLocation = async () => {
    if (!journey) return;

    setIsDetectingLocation(true);
    try {
      // Mock coordinates for demonstration - in production, use actual location
      // For now, let's simulate being near the middle of the journey
      const mockCoordinates = {
        longitude: 19.95,
        latitude: 50.06,
      };

      console.log('Detecting location with coordinates:', mockCoordinates);
      
      // TODO: In production, get actual user location
      // const { status } = await Location.requestForegroundPermissionsAsync();
      // const location = await Location.getCurrentPositionAsync({});
      // const coordinates = { longitude: location.coords.longitude, latitude: location.coords.latitude };

      // For now, just select a segment based on simple heuristic
      // In a real implementation, you would call the API:
      // const progress = await apiClient.getJourneyStage(journey.id, mockCoordinates);
      // Then find the segment that matches the current position

      // Simple demo: select segment in the middle
      const middleIndex = Math.floor(routeSegments.length / 2);
      setSelectedSegmentIndex(middleIndex);
      
      console.log('Auto-selected segment:', routeSegments[middleIndex]);
    } catch (error) {
      console.error('Error detecting location:', error);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSubmit = () => {
    const selectedSegment = routeSegments[selectedSegmentIndex];
    onSubmit?.({ 
      severity: selectedSeverity, 
      details,
      routeSegment: selectedSegment,
    });
    setDetails('');
    setSelectedSeverity(SEVERITY_OPTIONS[1].value);
    setSelectedSegmentIndex(0);
    setSubmitted(true);
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => (!submitted ? onClose() : undefined)}
      presentationStyle="overFullScreen"
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} disabled={submitted} onPress={!submitted ? onClose : undefined} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background,
              borderRadius: RADIUS_CARD,
              borderColor: colors.blue + '20',
            },
          ]}
        >
          {submitted ? (
            <View style={[styles.successContainer, { padding: 32 }]}>
              <Ionicons name="checkmark-circle" size={56} color={colors.pink} />
              <Text style={[styles.successTitle, { color: colors.text, marginTop: 18 }]}>
                Dziękujemy za zgłoszenie!
              </Text>
              <Text
                style={[
                  styles.successNote,
                  { color: colors.text + '80', marginTop: 10, textAlign: 'center' },
                ]}
              >
                Twoje zgłoszenie zostało zapisane.
              </Text>
            </View>
          ) : (
            <>
              <View
                style={[
                  styles.cardHeader,
                  { borderBottomColor: colors.blue + '25', paddingVertical: 16 },
                ]}
              >
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Zgłoszenie incydentu
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={22} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 }]}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.label, { color: colors.text }]}>Na odcinku</Text>
                    {routeSegments.length > 0 && (
                      <TouchableOpacity
                        style={[
                          styles.detectButton,
                          {
                            backgroundColor: colors.blue + '20',
                            borderColor: colors.blue,
                          },
                        ]}
                        onPress={handleDetectLocation}
                        disabled={isDetectingLocation}
                        activeOpacity={0.7}
                      >
                        {isDetectingLocation ? (
                          <Ionicons name="location" size={14} color={colors.blue} />
                        ) : (
                          <Ionicons name="navigate" size={14} color={colors.blue} />
                        )}
                        <Text style={[styles.detectButtonText, { color: colors.blue }]}>
                          {isDetectingLocation ? 'Wykrywanie...' : 'Moja lokalizacja'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {routeSegments.length > 0 ? (
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      style={styles.segmentScroll}
                    >
                      {routeSegments.map((segment, index) => {
                        const isSelected = index === selectedSegmentIndex;
                        return (
                          <TouchableOpacity
                            key={`${segment.routeId}-${index}`}
                            style={[
                              styles.segmentPill,
                              {
                                borderColor: isSelected ? colors.blue : colors.blue + '30',
                                backgroundColor: isSelected ? colors.blue + '22' : colors.blue + '10',
                                borderRadius: RADIUS_CONTROL,
                                borderWidth: isSelected ? 2 : 1,
                              },
                            ]}
                            onPress={() => handleSelectSegment(index)}
                            activeOpacity={0.7}
                          >
                            <Text 
                              style={[
                                styles.segmentPillText, 
                                { 
                                  color: colors.text,
                                  fontWeight: isSelected ? '600' : '500',
                                }
                              ]}
                            >
                              {segment.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  ) : (
                    <View
                      style={[
                        styles.readonlyPill,
                        {
                          borderColor: colors.blue + '30',
                          backgroundColor: colors.blue + '10',
                          borderRadius: RADIUS_CONTROL,
                        },
                      ]}
                    >
                      <Text style={[styles.readonlyPillText, { color: colors.text }]}>
                        Brak danych o trasie
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.section}>
                  <Text style={[styles.label, { color: colors.text }]}>Poziom incydentu</Text>

                  <View
                    style={[
                      styles.severityContainer,
                      { borderColor: colors.text + '25', borderRadius: RADIUS_CONTROL },
                    ]}
                  >
                    {SEVERITY_OPTIONS.map(option => {
                      const selected = option.value === selectedSeverity;
                      const baseColor = severityColorMap[option.value] || colors.text;
                      return (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.severityItem,
                            {
                              backgroundColor: selected ? baseColor + '22' : 'transparent',
                            },
                            selected && {
                              borderColor: baseColor,
                              borderWidth: 2,
                              borderRadius: RADIUS_CONTROL,
                            },
                          ]}
                          onPress={() => handleSelectSeverity(option.value)}
                          activeOpacity={0.75}
                        >
                          <Text style={[styles.severityText, { color: baseColor }]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {selectedSeverityDescription && (
                    <Text
                      style={[
                        styles.severityDescription,
                        { color: colors.text + '90' },
                      ]}
                    >
                      {selectedSeverityDescription}
                    </Text>
                  )}
                </View>

                <View style={styles.section}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Szczegóły (opcjonalne)
                  </Text>
                  <TextInput
                    style={[
                      styles.textArea,
                      {
                        borderColor: colors.text + '25',
                        color: colors.text,
                        backgroundColor: colors.background,
                        borderRadius: RADIUS_CONTROL,
                      },
                    ]}
                    value={details}
                    onChangeText={setDetails}
                    placeholder="Dodaj dodatkowy opis..."
                    placeholderTextColor={colors.text + '60'}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[
                      styles.cancelButton,
                      {
                        backgroundColor: colors.text + '12',
                        borderRadius: RADIUS_CONTROL,
                        borderColor: colors.text + '25',
                      },
                    ]}
                    onPress={onClose}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.cancelText, { color: colors.text }]}>Anuluj</Text>
                  </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        {
                          backgroundColor: colors.pink,
                          borderRadius: RADIUS_CONTROL,
                        },
                      ]}
                      onPress={handleSubmit}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.submitText, { color: 'white' }]}>Wyślij</Text>
                    </TouchableOpacity>
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: 24 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  card: {
    maxWidth: CARD_MAX_WIDTH,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  cardTitle: { flex: 1, fontSize: 18, fontWeight: '600' },
  closeButton: { padding: 4 },
  scroll: { maxHeight: 520 },
  scrollContent: { paddingHorizontal: 20 },
  section: { marginTop: 18 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  detectButtonText: {
    fontSize: 11,
    fontWeight: '600',
  },
  readonlyPill: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  readonlyPillText: { fontSize: 14, fontWeight: '500' },
  segmentScroll: {
    marginTop: 4,
  },
  segmentPill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    marginRight: 8,
    minWidth: 120,
  },
  segmentPillText: { 
    fontSize: 13, 
    textAlign: 'center',
  },
  severityContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    overflow: 'hidden',
  },
  severityItem: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityText: { fontSize: 14, fontWeight: '600' },
  severityDescription: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  textArea: {
    minHeight: 110,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 28,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: { fontSize: 15, fontWeight: '600' },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  submitText: { fontSize: 15, fontWeight: '600' },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  successNote: {
    fontSize: 13,
  },
});

export default IncidentReportForm;