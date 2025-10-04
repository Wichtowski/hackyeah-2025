import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { CommuteType } from '@/types/commuting';

interface TransportOption {
  type: CommuteType;
  icon: string;
  label: string;
  color: string;
}

const TRANSPORT_OPTIONS: TransportOption[] = [
  { type: 'bus', icon: '🚌', label: 'Bus', color: '#486db1' },
  { type: 'tram', icon: '🚊', label: 'Tram', color: '#98c254' },
  { type: 'train', icon: '🚆', label: 'Train', color: '#d83189' },
];

interface DefaultCommuteSettingsProps {
  selectedType: CommuteType | null;
  onTypeSelect: (type: CommuteType) => void;
}

const DefaultCommuteSettings: React.FC<DefaultCommuteSettingsProps> = ({
  selectedType,
  onTypeSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Default Commute Type</Text>
      <Text style={styles.subtitle}>Choose your preferred transportation method</Text>
      
      <View style={styles.optionsContainer}>
        {TRANSPORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={[
              styles.optionButton,
              selectedType === option.type && styles.selectedOption,
              { borderColor: option.color }
            ]}
            onPress={() => onTypeSelect(option.type)}
          >
            <Text style={styles.optionIcon}>{option.icon}</Text>
            <Text style={[
              styles.optionLabel,
              selectedType === option.type && styles.selectedLabel
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.text + '80',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: Colors.light.background,
  },
  selectedOption: {
    backgroundColor: Colors.light.background + '20',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  selectedLabel: {
    fontWeight: '600',
  },
});

export default DefaultCommuteSettings;
