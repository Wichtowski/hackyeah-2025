import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface SettingsButtonProps {
  onPress: () => void;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
    >
      <Ionicons name="settings" size={24} color={Colors.light.background} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.icon,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
});
