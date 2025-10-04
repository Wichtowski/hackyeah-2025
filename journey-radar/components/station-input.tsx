import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Station, StationInputProps } from '@/types/station';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const StationInput: React.FC<StationInputProps> = ({
  onSourceChange,
  onDestinationChange,
  sourceStation,
  destinationStation,
}) => {
  const [sourceText, setSourceText] = useState<string>(sourceStation?.name || '');
  const [destinationText, setDestinationText] = useState<string>(destinationStation?.name || '');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleSourceChange = (text: string): void => {
    setSourceText(text);
    // For now, we'll create a mock station object
    // In a real app, this would search for stations and return actual data
    if (text.trim()) {
      const mockStation: Station = {
        id: `source-${text}`,
        name: text,
        coordinates: {
          latitude: 50.05936,
          longitude: 19.93435,
        },
        type: 'bus',
      };
      onSourceChange(mockStation);
    } else {
      onSourceChange(null);
    }
  };

  const handleDestinationChange = (text: string): void => {
    setDestinationText(text);
    // For now, we'll create a mock station object
    // In a real app, this would search for stations and return actual data
    if (text.trim()) {
      const mockStation: Station = {
        id: `destination-${text}`,
        name: text,
        coordinates: {
          latitude: 50.0647,
          longitude: 19.9450,
        },
        type: 'bus',
      };
      onDestinationChange(mockStation);
    } else {
      onDestinationChange(null);
    }
  };

  const clearSource = (): void => {
    setSourceText('');
    onSourceChange(null);
  };

  const clearDestination = (): void => {
    setDestinationText('');
    onDestinationChange(null);
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

  return (
    <View style={[styles.container, isCollapsed && styles.collapsedContainer]}>
      <View style={[styles.inputContainer, isCollapsed && styles.collapsedInputContainer]}>
        {!isCollapsed && (
          <>
            <View style={styles.inputWrapper}>
              <View style={styles.inputHeader}>
                <Ionicons name="location" size={16} color={Colors.light.icon} />
                <Text style={styles.inputLabel}>From</Text>
              </View>
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.inputField}
                  value={sourceText}
                  onChangeText={handleSourceChange}
                  placeholder="Enter source station"
                  placeholderTextColor={Colors.light.icon}
                />
                {sourceText.length > 0 && (
                  <TouchableOpacity onPress={clearSource} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={Colors.light.icon} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TouchableOpacity onPress={swapStations} style={styles.swapButton}>
              <Ionicons name="swap-vertical" size={20} color={Colors.light.icon} />
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
              <View style={styles.inputHeader}>
                <Ionicons name="flag" size={16} color={Colors.light.icon} />
                <Text style={styles.inputLabel}>To</Text>
              </View>
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.inputField}
                  value={destinationText}
                  onChangeText={handleDestinationChange}
                  placeholder="Enter destination station"
                  placeholderTextColor={Colors.light.icon}
                />
                {destinationText.length > 0 && (
                  <TouchableOpacity onPress={clearDestination} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={Colors.light.icon} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        )}
        
        <TouchableOpacity onPress={toggleCollapse} style={styles.toggleButton}>
          <Ionicons 
            name={isCollapsed ? "chevron-down" : "chevron-up"} 
            size={24} 
            color={Colors.light.icon} 
          />
        </TouchableOpacity>
      </View>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    width: '100%',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  inputWrapper: {
    marginBottom: 12,
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
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.icon + '30',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.background,
  },
  inputField: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.light.text,
  },
  clearButton: {
    padding: 4,
  },
  swapButton: {
    alignSelf: 'center',
    padding: 8,
    backgroundColor: Colors.light.icon + '20',
    borderRadius: 20,
    marginVertical: 8,
  },
  toggleButton: {
    padding: 8,
    backgroundColor: Colors.light.icon + '20',
    borderRadius: 20,
    alignSelf: 'center',
  },
});
