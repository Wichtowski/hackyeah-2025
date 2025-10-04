import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import {Colors} from '@/constants/theme';
import SlideTab from './slide-tab';
import {SEVERITY_OPTIONS} from '@/types/incident-severity';

const IncidentReportForm: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState(SEVERITY_OPTIONS[1].value);
  const [details, setDetails] = useState('');

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  const handleSelectSeverity = (severity: string) => {
    setSelectedSeverity(severity);
  };

  const handleSubmit = () => {
    // TODO: integrate submission logic
    setDetails('');
    setSelectedSeverity(SEVERITY_OPTIONS[1].value);
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
            <Text style={styles.label}>Na odcinku</Text>
            <Text style={[styles.severityItem, styles.severityContainer, styles.severityText]}>Kraków Gł. → Wieliczka</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.labelWithIcon}>
              <Text style={styles.label}>Poziom incydentu</Text>
            </View>

            <View style={styles.severityContainer}>
              {SEVERITY_OPTIONS.map((option, index) => {
                const selected = option.value === selectedSeverity;
                const isLast = index === SEVERITY_OPTIONS.length - 1;

                const getSeverityStyle = (value: string, selected: boolean) => {
                  switch (value) {
                    case 'low':
                      return styles.severityLow;
                    case 'medium':
                      return styles.severityMedium;
                    case 'severe':
                      return styles.severitySevere;
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
                      selected && styles.severitySelected,
                      isLast && {borderRightWidth: 0}
                    ]}
                    onPress={() => handleSelectSeverity(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.severityText, getSeverityStyle(option.value, selected)]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.severityDescription}>
              {SEVERITY_OPTIONS.find(option => option.value === selectedSeverity)?.description}
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
  severityText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  severityLow: {
    color: '#006400',
  },
  severityMedium: {
    color: '#B8860B',
  },
  severitySevere: {
    color: '#f44336',
  },
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
  actions: {
    paddingVertical: 12,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButton: {
    paddingVertical: 15,
    backgroundColor: Colors.light.icon,
    paddingHorizontal: 22,
    borderRadius: 22,
  },
  submitText: {
    color: Colors.light.background,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  severityDescription: {
    fontSize: 13,
    color: Colors.light.icon,
    marginTop: 8,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});

export default IncidentReportForm;