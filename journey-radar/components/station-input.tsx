import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Station } from '@/types/journey';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface StationInputProps {
  onSourceChange: (station: Station | null) => void;
  onDestinationChange: (station: Station | null) => void;
  sourceStation: Station | null;
  destinationStation: Station | null;
  absolutePosition?: boolean;
  enableChevron?: boolean;
}

export const StationInput: React.FC<StationInputProps> = ({
  onSourceChange,
  onDestinationChange,
  sourceStation,
  destinationStation,
  absolutePosition = true,
  enableChevron = false,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const accent = theme.blue ?? theme.tint ?? '#4C8DFF';

  const [sourceText, setSourceText] = useState<string>(sourceStation?.name || '');
  const [destinationText, setDestinationText] = useState<string>(destinationStation?.name || '');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isSourceFocused, setIsSourceFocused] = useState<boolean>(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState<boolean>(false);

  useEffect(() => { setSourceText(sourceStation?.name || ''); }, [sourceStation]);
  useEffect(() => { setDestinationText(destinationStation?.name || ''); }, [destinationStation]);

  const handleSourceChange = (text: string): void => {
    setSourceText(text);
    if (text.trim()) {
      onSourceChange({
        id: `source-${text}`,
        name: text,
        position: { latitude: 50.05936, longitude: 19.93435 },
      });
    } else onSourceChange(null);
  };

  const handleDestinationChange = (text: string): void => {
    setDestinationText(text);
    if (text.trim()) {
      onDestinationChange({
        id: `destination-${text}`,
        name: text,
        position: { latitude: 50.0647, longitude: 19.945 },
      });
    } else onDestinationChange(null);
  };

  const clearSource = (): void => {
    setSourceText('');
    onSourceChange(null);
  };

  const swapStations = (): void => {
    const tempSource = sourceText;
    const tempStation = sourceStation;
    setSourceText(destinationText);
    setDestinationText(tempSource);
    onSourceChange(destinationStation);
    onDestinationChange(tempStation);
  };

  const toggleCollapse = (): void => setIsCollapsed(!isCollapsed);

  return (
    <View style={[
      styles.container,
      !absolutePosition && styles.relativeContainer,
      enableChevron && isCollapsed && styles.collapsedContainer
    ]}>
      <View style={[
        styles.inputContainer,
        { backgroundColor: theme.background, shadowColor: '#000' },
        !absolutePosition && styles.noBorderInputContainer,
        enableChevron && isCollapsed && styles.collapsedInputContainer
      ]}>
        {(!enableChevron || !isCollapsed) && (
          <>
            <View>
              <View style={[
                styles.inputFieldContainer,
                { borderColor: isSourceFocused ? accent : '#2E2E2E' },
                isSourceFocused && styles.inputFieldContainerFocused
              ]}>
                <View style={styles.iconContainer}>
                  <Ionicons name="location" size={20} color={accent} />
                </View>
                <TextInput
                  id="source-station"
                  style={[styles.inputField, { outlineStyle: 'none' as never }]}
                  value={sourceText}
                  onChangeText={handleSourceChange}
                  onFocus={() => setIsSourceFocused(true)}
                  onBlur={() => setIsSourceFocused(false)}
                  placeholder="Stacja początkowa"
                  placeholderTextColor="#888"
                  autoComplete="off"
                />
                {sourceText.length > 0 && (
                  <TouchableOpacity onPress={clearSource} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={accent} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={[styles.separatorLine, { backgroundColor: '#333' }]} />

            <View>
              <View style={[
                styles.inputFieldContainer,
                { borderColor: isDestinationFocused ? accent : '#2E2E2E' },
                isDestinationFocused && styles.inputFieldContainerFocused
              ]}>
                <View style={styles.iconContainer}>
                  <Ionicons name="flag" size={20} color={accent} />
                </View>
                <TextInput
                  id="destination-station"
                  style={[styles.inputField, { outlineStyle: 'none' as never }]}
                  value={destinationText}
                  onChangeText={handleDestinationChange}
                  onFocus={() => setIsDestinationFocused(true)}
                  onBlur={() => setIsDestinationFocused(false)}
                  placeholder="Stacja docelowa"
                  placeholderTextColor="#888"
                  autoComplete="off"
                />
                {destinationText.length > 0 && (
                  <TouchableOpacity onPress={swapStations} style={styles.swapButton}>
                    <Ionicons name="swap-vertical" size={20} color={accent} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        )}

        {enableChevron && (
          <TouchableOpacity onPress={toggleCollapse} style={[styles.toggleButton, { backgroundColor: accent + '33' }]}>
            <Ionicons
              name={isCollapsed ? 'chevron-down' : 'chevron-up'}
              size={24}
              color={accent}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const DARK_FIELD_BG = '#1E1E1E';
const DARK_FIELD_FOCUS_BG = '#262626';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    zIndex: 2000,
    paddingHorizontal: 0,
  },
  relativeContainer: { position: 'relative', top: 0, zIndex: 1 },
  collapsedContainer: { top: 0, bottom: 'auto', zIndex: 2000, position: 'absolute' },
  inputContainer: {
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    width: '100%',
  },
  noBorderInputContainer: { borderRadius: 0, shadowOpacity: 0, elevation: 0 },
  collapsedInputContainer: {
    top: 44,
    height: 50,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: '#333',
  },
  iconContainer: { padding: 8, marginRight: 4 },
  separatorLine: { height: 1, marginVertical: 12, marginHorizontal: 4 },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 4,
    backgroundColor: DARK_FIELD_BG,
    borderWidth: 1,
    minHeight: 52,
  },
  inputFieldContainerFocused: {
    backgroundColor: DARK_FIELD_FOCUS_BG,
  },
  inputField: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#FFF',
  },
  clearButton: { padding: 4 },
  swapButton: { padding: 4, marginLeft: 4 },
  toggleButton: {
    padding: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 8
  },
});