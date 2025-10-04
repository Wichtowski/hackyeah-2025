// journey-radar/components/incident-report-form.tsx
import React, { useState, useMemo } from 'react';
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

interface IncidentReportFormProps {
  visible?: boolean;
  onClose: () => void;
  onSubmit?: (payload: { severity: string; details: string }) => void;
}

const RADIUS_CONTROL = 12;
const RADIUS_CARD = 16;
const CARD_MAX_WIDTH = 420;

const IncidentReportForm: React.FC<IncidentReportFormProps> = ({
  visible = false,
  onClose,
  onSubmit,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedSeverity, setSelectedSeverity] = useState(SEVERITY_OPTIONS[1].value);
  const [details, setDetails] = useState('');

  const severityColorMap: Record<string, string> = {
    low: colors.blue,
    medium: colors.yellow,
    severe: colors.pink,
  };

  const selectedSeverityDescription = useMemo(
    () => SEVERITY_OPTIONS.find(o => o.value === selectedSeverity)?.description,
    [selectedSeverity]
  );

  if (!visible) return null;

  const handleSelectSeverity = (severity: string) => setSelectedSeverity(severity);

  const handleSubmit = () => {
    onSubmit?.({ severity: selectedSeverity, details });
    setDetails('');
    setSelectedSeverity(SEVERITY_OPTIONS[1].value);
    onClose();
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

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
              <Text style={[styles.label, { color: colors.text }]}>Na odcinku</Text>
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
                  Kraków Gł. → Wieliczka
                </Text>
              </View>
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
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  readonlyPill: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  readonlyPillText: { fontSize: 14, fontWeight: '500' },
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
});

export default IncidentReportForm;