import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  Modal, Pressable, KeyboardAvoidingView, Platform
} from 'react-native';
import { Colors } from '@/constants/theme';
import { SEVERITY_OPTIONS } from '@/types/incident-severity';
import { Ionicons } from '@expo/vector-icons';
import {useColorScheme} from "@/hooks/use-color-scheme";

interface IncidentReportFormProps {
  visible?: boolean;
  onClose: () => void;
  onSubmit?: (payload: { severity: string; details: string }) => void;
}

const IncidentReportForm: React.FC<IncidentReportFormProps> = ({
  visible = false,
  onClose,
  onSubmit,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedSeverity, setSelectedSeverity] = useState(SEVERITY_OPTIONS[1].value);
  const [details, setDetails] = useState('');

  if (!visible) return null; // Prevent mounting the Modal when not needed

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

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Zgłoszenie incydentu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={Colors.light.icon} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.section}>
              <Text style={styles.label}>Na odcinku</Text>
              <Text style={[styles.severityItem, styles.severityContainer, styles.severityText]}>
                Kraków Gł. → Wieliczka
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Poziom incydentu</Text>
              <View style={styles.severityContainer}>
                {SEVERITY_OPTIONS.map((option, index) => {
                  const selected = option.value === selectedSeverity;
                  const isLast = index === SEVERITY_OPTIONS.length - 1;

                  const getSeverityStyle = (value: string) => {
                    switch (value) {
                      case 'low': return styles.severityLow;
                      case 'medium': return styles.severityMedium;
                      case 'severe': return styles.severitySevere;
                      default: return {};
                    }
                  };

                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.severityItem,
                        getSeverityStyle(option.value),
                        selected && styles.severitySelected,
                        isLast && { borderRightWidth: 0 },
                      ]}
                      onPress={() => handleSelectSeverity(option.value)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.severityText, getSeverityStyle(option.value)]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.severityDescription}>
                {SEVERITY_OPTIONS.find(o => o.value === selectedSeverity)?.description}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Szczegóły (opcjonalne)</Text>
              <TextInput
                style={styles.textArea}
                value={details}
                onChangeText={setDetails}
                placeholder="Dodaj dodatkowy opis..."
                placeholderTextColor={Colors.light.icon}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.pink }]}
                onPress={handleSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.submitText}>Wyślij</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const CARD_MAX_WIDTH = 420;
const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: 24 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  card: {
    maxWidth: CARD_MAX_WIDTH,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 24,
    paddingBottom: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.icon + '20',
  },
  cardTitle: { flex: 1, fontSize: 18, fontWeight: '600', color: Colors.light.text },
  closeButton: { padding: 4 },
  scroll: { maxHeight: 520 },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 28 },
  section: { marginTop: 20 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  severityContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.light.icon + '25',
    borderRadius: 22,
    overflow: 'hidden',
  },
  severityItem: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: Colors.light.icon + '15',
    alignItems: 'center',
  },
  severityText: { fontSize: 15, fontWeight: '600', textAlign: 'center' },
  severityLow: { color: '#006400' },
  severityMedium: { color: '#B8860B' },
  severitySevere: { color: '#f44336' },
  severitySelected: {
    borderWidth: 2,
    borderRightWidth: 2,
    borderRightColor: Colors.light.icon,
    borderRadius: 22,
  },
  textArea: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: Colors.light.icon + '25',
    borderRadius: 22,
    padding: 12,
    fontSize: 14,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  actions: { paddingTop: 24, flexDirection: 'row', justifyContent: 'center' },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  submitText: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  severityDescription: {
    fontSize: 13,
    color: Colors.light.icon,
    marginTop: 8,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});

export default IncidentReportForm;