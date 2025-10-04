import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import SlideTab from '@/components/slide-tab';
import DefaultCommuteSettings from '@/components/default-commute-settings';
import { CommuteType } from '@/types/commuting';

interface HeaderProps {
  absolutePosition?: boolean;
  onSettingsPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ absolutePosition = false, onSettingsPress }) => {
  const [isSlideTabVisible, setIsSlideTabVisible] = useState(false);
  const [defaultCommuteType, setDefaultCommuteType] = useState<CommuteType | null>(null);

  const handleCommuteTypeSelect = (type: CommuteType): void => {
    setDefaultCommuteType(type);
    console.log('Default commute type set to:', type);
  };

  return (
    <>
      <View style={[styles.container, absolutePosition && styles.absolutePosition]}>
        <View style={styles.centerSection}>
          <Text style={styles.projectTitle}>Journey Radar</Text>
          <FontAwesome name="map" size={20} style={{ marginLeft: 8 }} color={Colors.light.blue} />
        </View>
        <TouchableOpacity onPress={() => setIsSlideTabVisible(true)} style={styles.settingsButton}>
          <Ionicons name="settings" size={20} color={Colors.light.icon} />
        </TouchableOpacity>
      </View>

      <SlideTab
        visible={isSlideTabVisible}
        onClose={() => setIsSlideTabVisible(false)}
        title="Commute Settings"
      >
        <DefaultCommuteSettings
          selectedType={defaultCommuteType}
          onTypeSelect={handleCommuteTypeSelect}
        />
      </SlideTab>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
  absolutePosition: {
    position: 'absolute',
  },
});

