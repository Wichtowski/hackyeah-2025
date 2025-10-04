import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface HeaderProps {
  onSettingsPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.centerSection}>
        <Text style={styles.projectTitle}>Journey Radar</Text>
        <FontAwesome name="map" size={20} style={{ marginLeft: 8 }} color={Colors.light.blue} />
      </View>
      <TouchableOpacity onPress={onSettingsPress} style={styles.settingsButton}>
        <Ionicons name="settings" size={20} color={Colors.light.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.light.background,
    elevation: 4,
    zIndex: 3000,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  settingsButton: {
    position: 'absolute',
    right: 20,
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.icon + '20',
  },
});

