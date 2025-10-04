import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Station, StationInputProps } from '@/types/station';

export const StationInput: React.FC<StationInputProps> = ({
  onSourceChange,
  onDestinationChange,
  sourceStation,
  destinationStation,
  absolutePosition = true,
  enableChevron = false,
  onSearch,
}) => {
  const [sourceText, setSourceText] = useState<string>(sourceStation?.name || '');
  const [destinationText, setDestinationText] = useState<string>(destinationStation?.name || '');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isSourceFocused, setIsSourceFocused] = useState<boolean>(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState<boolean>(false);

  // Update local text states when props change (from context)
  useEffect(() => {
    setSourceText(sourceStation?.name || '');
  }, [sourceStation]);

  useEffect(() => {
    setDestinationText(destinationStation?.name || '');
  }, [destinationStation]);

  const handleSourceChange = (text: string): void => {
    setSourceText(text);
    if (!text.trim()) {
      onSourceChange(null);
    }
  };

  const handleDestinationChange = (text: string): void => {
    setDestinationText(text);
    if (!text.trim()) {
      onDestinationChange(null);
    }
  };

  const clearSource = (): void => {
    setSourceText('');
    onSourceChange(null);
  };

  const swapStations = (): void => {
    const tempSource = sourceText;
    const tempSourceStation = sourceStation;
    
    setSourceText(destinationText);
    setDestinationText(tempSource);
    
    onSourceChange(destinationStation);
    onDestinationChange(tempSourceStation);
  };

  const toggleCollapse = (): void => {
    console.log('Toggling collapse, current state:', isCollapsed);
    setIsCollapsed(!isCollapsed);
  };

  const handleSearch = (): void => {
    if (sourceText.trim() && destinationText.trim() && onSearch) {
      onSearch(sourceText.trim(), destinationText.trim());
    }
  };

  const showSearchButton = sourceText.trim().length > 0 && destinationText.trim().length > 0;

  return (
    <View style={[styles.container, !absolutePosition && styles.relativeContainer, enableChevron && isCollapsed && styles.collapsedContainer]}>
      <View style={[styles.inputContainer, !absolutePosition && styles.noBorderInputContainer, enableChevron && isCollapsed && styles.collapsedInputContainer]}>
        {(!enableChevron || !isCollapsed) && (
          <>
            <View>
              <View style={[styles.inputFieldContainer, isSourceFocused && styles.inputFieldContainerFocused]}>
                <View style={styles.iconContainer}>
                  <Ionicons name="location" size={20} color={Colors.light.icon} />
                </View>
                <TextInput
                  id="source-station"
                  style={[styles.inputField, { outlineStyle: 'none' } as never]}
                  value={sourceText}
                  onChangeText={handleSourceChange}
                  autoCorrect={true}
                  onFocus={() => setIsSourceFocused(true)}
                  onBlur={() => setIsSourceFocused(false)}
                  autoComplete='off'
                  placeholder="Stacja początkowa"
                  placeholderTextColor={Colors.light.icon}
                />
                {sourceText.length > 0 && (
                  <TouchableOpacity onPress={clearSource} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={Colors.light.icon} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.separatorLine} />
            
            <View>
              <View style={[styles.inputFieldContainer, isDestinationFocused && styles.inputFieldContainerFocused]}>
                <View style={styles.iconContainer}>
                  <Ionicons name="flag" size={20} color={Colors.light.icon} />
                </View>
                <TextInput
                  id="destination-station"
                  style={[styles.inputField, { outlineStyle: 'none' } as never]}
                  value={destinationText}
                  onChangeText={handleDestinationChange}
                  onFocus={() => setIsDestinationFocused(true)}
                  onBlur={() => setIsDestinationFocused(false)}
                  placeholder="Stacja docelowa"
                  placeholderTextColor={Colors.light.icon}
                  autoComplete='off'
                />
                {destinationText.length > 0 && (
                <TouchableOpacity onPress={swapStations} style={styles.swapButton}>
                  <Ionicons name="swap-vertical" size={20} color={Colors.light.icon} />
                </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        )}
        
        {enableChevron && (
          <TouchableOpacity onPress={toggleCollapse} style={styles.toggleButton}>
            <Ionicons 
              name={isCollapsed ? "chevron-down" : "chevron-up"} 
              size={24} 
              color={Colors.light.icon} 
            />
          </TouchableOpacity>
        )}
      </View>

      {showSearchButton && !isCollapsed && (
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#fff" />
          <Text style={styles.searchButtonText}>Szukaj</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    zIndex: 2000,
    paddingHorizontal: 0,
  },
  relativeContainer: {
    position: 'relative',
    top: 0,
    zIndex: 1,
  },
  collapsedContainer: {
    top: 0,
    bottom: 'auto',
    zIndex: 2000,
    position: 'absolute',
  },
  inputContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.25)',
    elevation: 8,
    width: '100%',
  },
  noBorderInputContainer: {
    borderRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    boxShadow: 'none',
    elevation: 0,
  },
  collapsedInputContainer: {
    top: 44,
    height: 50,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.icon + '30',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.25)',
    elevation: 8,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 8,
  },
  iconContainer: {
    padding: 8,
    marginRight: 8,
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.light.icon + '30',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 0,
  },
  inputFieldContainerFocused: {
    backgroundColor: '#f1f1f1',
    borderWidth: 0,
  },
  inputField: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 0,
  },
  clearButton: {
    padding: 4,
  },
  swapButton: {
    padding: 4,
    marginLeft: 8,
  },
  toggleButton: {
    padding: 8,
    backgroundColor: Colors.light.icon + '20',
    borderRadius: 20,
    alignSelf: 'center',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.green,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
