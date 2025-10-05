import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Station } from '@/types/journey';
import { useColorScheme } from '@/hooks/use-color-scheme';
import LocalStopsService, { StopWithDegrees } from '@/services/localStopsService';

export interface StationInputProps {
  onSourceChange: (station: Station | null) => void;
  onDestinationChange: (station: Station | null) => void;
  sourceStation: Station | null;
  destinationStation: Station | null;
  absolutePosition?: boolean;
  enableChevron?: boolean;
  onFocusChange?: (isFocused: boolean) => void;
}

export const StationInput: React.FC<StationInputProps> = ({
  onSourceChange,
  onDestinationChange,
  sourceStation,
  destinationStation,
  absolutePosition = true,
  enableChevron = false,
  onFocusChange,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const accent = theme.blue ?? theme.tint ?? '#4C8DFF';

  const [sourceText, setSourceText] = useState<string>(sourceStation?.name || '');
  const [destinationText, setDestinationText] = useState<string>(destinationStation?.name || '');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isSourceFocused, setIsSourceFocused] = useState<boolean>(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState<boolean>(false);
  const [sourceSuggestions, setSourceSuggestions] = useState<StopWithDegrees[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<StopWithDegrees[]>([]);

  useEffect(() => { setSourceText(sourceStation?.name || ''); }, [sourceStation]);
  useEffect(() => { setDestinationText(destinationStation?.name || ''); }, [destinationStation]);

  // Notify parent about focus state changes
  useEffect(() => {
    const isFocused = isSourceFocused || isDestinationFocused;
    onFocusChange?.(isFocused);
  }, [isSourceFocused, isDestinationFocused, onFocusChange]);

  const handleSourceChange = (text: string): void => {
    setSourceText(text);
    
    // Get autocomplete suggestions and sort alphabetically
    const suggestions = LocalStopsService.searchByNamePrefix(text);
    // Filter out destination station if it's selected
    const filteredSuggestions = destinationStation 
      ? suggestions.filter(s => s.name !== destinationStation.name)
      : suggestions;
    const sortedSuggestions = filteredSuggestions.sort((a, b) => a.name.localeCompare(b.name));
    setSourceSuggestions(sortedSuggestions);
    
    if (text.trim()) {
      onSourceChange({
        id: `source-${text}`,
        name: text,
        position: { latitude: 50.05936, longitude: 19.93435 },
      });
    } else {
      onSourceChange(null);
      setSourceSuggestions([]);
    }
  };

  const handleDestinationChange = (text: string): void => {
    setDestinationText(text);
    
    // Get autocomplete suggestions and sort alphabetically
    const suggestions = LocalStopsService.searchByNamePrefix(text);
    // Filter out source station if it's selected
    const filteredSuggestions = sourceStation 
      ? suggestions.filter(s => s.name !== sourceStation.name)
      : suggestions;
    const sortedSuggestions = filteredSuggestions.sort((a, b) => a.name.localeCompare(b.name));
    setDestinationSuggestions(sortedSuggestions);
    
    if (text.trim()) {
      onDestinationChange({
        id: `destination-${text}`,
        name: text,
        position: { latitude: 50.0647, longitude: 19.945 },
      });
    } else {
      onDestinationChange(null);
      setDestinationSuggestions([]);
    }
  };

  const selectSourceSuggestion = (stop: StopWithDegrees): void => {
    setSourceText(stop.name);
    onSourceChange({
      id: stop.id,
      name: stop.name,
      position: { latitude: stop.latitude, longitude: stop.longitude },
    });
    setSourceSuggestions([]);
    Keyboard.dismiss();
  };

  const selectDestinationSuggestion = (stop: StopWithDegrees): void => {
    setDestinationText(stop.name);
    onDestinationChange({
      id: stop.id,
      name: stop.name,
      position: { latitude: stop.latitude, longitude: stop.longitude },
    });
    setDestinationSuggestions([]);
    Keyboard.dismiss();
  };

  const clearSource = (): void => {
    setSourceText('');
    onSourceChange(null);
    setSourceSuggestions([]);
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
                  onBlur={() => setTimeout(() => setIsSourceFocused(false), 200)}
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
              
              {isSourceFocused && sourceSuggestions.length > 0 && (
                <View style={[styles.suggestionsContainer, { backgroundColor: theme.background }]}>
                  <FlatList
                    data={sourceSuggestions}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    style={styles.suggestionsList}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[styles.suggestionItem, { borderBottomColor: '#333' }]}
                        onPress={() => selectSourceSuggestion(item)}
                      >
                        <Ionicons name="location-outline" size={16} color={accent} style={styles.suggestionIcon} />
                        <View style={styles.suggestionTextContainer}>
                          <Text style={[styles.suggestionName, { color: theme.text }]}>{item.name}</Text>
                          <Text style={styles.suggestionCategory}>{item.category}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
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
                  onBlur={() => setTimeout(() => setIsDestinationFocused(false), 200)}
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
              
              {isDestinationFocused && destinationSuggestions.length > 0 && (
                <View style={[styles.suggestionsContainer, { backgroundColor: theme.background }]}>
                  <FlatList
                    data={destinationSuggestions}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    style={styles.suggestionsList}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[styles.suggestionItem, { borderBottomColor: '#333' }]}
                        onPress={() => selectDestinationSuggestion(item)}
                      >
                        <Ionicons name="location-outline" size={16} color={accent} style={styles.suggestionIcon} />
                        <View style={styles.suggestionTextContainer}>
                          <Text style={[styles.suggestionName, { color: theme.text }]}>{item.name}</Text>
                          <Text style={styles.suggestionCategory}>{item.category}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
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
  suggestionsContainer: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    maxHeight: 200,
    overflow: 'hidden',
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  suggestionCategory: {
    fontSize: 12,
    color: '#888',
    textTransform: 'capitalize',
  },
});