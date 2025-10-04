import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import {Colors} from '@/constants/theme';
import {Ionicons} from '@expo/vector-icons';
import SlideTab from './slide-tab';
import {SEVERITY_OPTIONS} from '@/types/incident-severity';

const IncidentReportForm: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState(SEVERITY_OPTIONS[0].value);
  const [details, setDetails] = useState('');

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  const handleSelectSeverity = (severity: string) => {
    setSelectedSeverity(severity);
  };

  const handleSubmit = () => {
    // TODO: integrate submission logic
    setDetails('');
    setSelectedSeverity(SEVERITY_OPTIONS[0].value);
    setVisible(false);
  };

  return (
    <>
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.triggerButton} onPress={open} activeOpacity={0.7}>
          <Text style={styles.triggerText}>Zgłoś</Text>
        </TouchableOpacity>
      </View>

      <SlideTab
        visible={visible}
        onClose={close}
        title="Zgłoszenie incydentu"
        width={360}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={styles.label}>Na trasie:</Text>
            <Text style={styles.journeyText}>Kraków Gł. → Wieliczka</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.labelWithIcon}>
              <Text style={styles.label}>Poziom incydentu</Text>
              <TouchableOpacity style={styles.helpIcon} activeOpacity={0.7}>
                <Ionicons name="help-circle-outline" size={18} color={Colors.light.icon}/>
              </TouchableOpacity>
            </View>

            <View style={styles.severityContainer}>
              {SEVERITY_OPTIONS.map((option, index) => {
                const selected = option.value === selectedSeverity;
                const isLast = index === SEVERITY_OPTIONS.length - 1;

                // Get severity-specific styles
                const getSeverityStyle = (value: string, selected: boolean) => {
                  switch (value) {
                    case 'low':
                      return selected ? styles.severityLowSelected : styles.severityLow;
                    case 'medium':
                      return selected ? styles.severityMediumSelected : styles.severityMedium;
                    case 'severe':
                      return selected ? styles.severitySevereSelected : styles.severitySevere;
                    default:
                      return {};
                  }
                };

                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.severityItem,
                      getSeverityStyle(option.value, selected),
                      isLast && {borderRightWidth: 0}
                    ]}
                    onPress={() => handleSelectSeverity(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.severityText, selected && styles.severityTextSelected]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
              <Text style={styles.submitText}>Wyślij</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SlideTab>
    </>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 50,
  },
  triggerButton: {
    backgroundColor: Colors.light.background,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.icon + '30',
  },
  triggerText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  helpIcon: {
    marginLeft: 6,
    top: -3,
  },
  journeyText: {
    fontSize: 15,
    color: Colors.light.text,
  },
  severityContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.light.icon + '25',
    borderRadius: 12,
    overflow: 'hidden',
  },
  severityItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: Colors.light.icon + '15',
    alignItems: 'center',
  },
  severityText: {
    fontSize: 13,
    color: Colors.light.text,
    textAlign: 'center',
  },
  severityTextSelected: {
    fontWeight: '600',
    color: '#fff',
  },
  severityLow: {
    backgroundColor: '#ffffe1',
  },
  severityLowSelected: {
    backgroundColor: '#f1c232',
  },
  severityMedium: {
    backgroundColor: '#fff8dd',
  },
  severityMediumSelected: {
    backgroundColor: '#eb8c00',
  },
  severitySevere: {
    backgroundColor: '#ffebee',
  },
  severitySevereSelected: {
    backgroundColor: '#f44336',
  },
  textArea: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: Colors.light.icon + '25',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  actions: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  submitButton: {
    backgroundColor: Colors.light.icon,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  submitText: {
    color: Colors.light.background,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default IncidentReportForm;