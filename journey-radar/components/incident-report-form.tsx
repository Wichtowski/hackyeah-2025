import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Colors } from '@/constants/theme';
import SlideTab from './slide-tab';

const IncidentReportForm: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState('');

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  const handleSubmit = () => {
    // TODO: integrate submission logic
    setDetails('');
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
  journeyText: {
    fontSize: 15,
    color: Colors.light.text,
  },
  stepsContainer: {
    borderWidth: 1,
    borderColor: Colors.light.icon + '25',
    borderRadius: 12,
    overflow: 'hidden',
  },
  stepItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.icon + '15',
  },
  stepItemSelected: {
    backgroundColor: Colors.light.icon + '15',
  },
  stepText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  stepTextSelected: {
    fontWeight: '600',
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