import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import SlideTab from './slide-tab';
import { Colors } from '@/constants/theme';

const SlideTabExample: React.FC = () => {
  const [isTabVisible, setIsTabVisible] = useState(false);

  const handleOpenTab = (): void => {
    setIsTabVisible(true);
  };

  const handleCloseTab = (): void => {
    setIsTabVisible(false);
  };

  const renderComplexData = (): React.ReactNode => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.light.text }]}>
          Sample Data
        </Text>
        <Text style={[styles.sectionText, { color: Colors.light.icon }]}>
          This is an example of complex data that can be displayed in the slide tab.
          The content can include any React components, forms, lists, or other UI elements.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.light.text }]}>
          Features
        </Text>
        <View style={styles.featureList}>
          {[
            'Smooth slide-in animation from the right',
            'Backdrop overlay with tap-to-close',
            'Customizable width and title',
            'Safe area aware',
            'TypeScript support',
            'Theme integration',
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={[styles.bullet, { color: Colors.light.blue }]}>•</Text>
              <Text style={[styles.featureText, { color: Colors.light.text }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.light.text }]}>
          Usage
        </Text>
        <Text style={[styles.codeText, { color: Colors.light.icon }]}>
          {`<SlideTab
  visible={isVisible}
  onClose={handleClose}
  title="My Tab"
  width={300}
>
  <YourComplexContent />
</SlideTab>`}
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.openButton, { backgroundColor: Colors.light.blue }]}
        onPress={handleOpenTab}
      >
        <Text style={[styles.buttonText, { color: Colors.light.background }]}>
          Open Slide Tab
        </Text>
      </TouchableOpacity>

      <SlideTab
        visible={isTabVisible}
        onClose={handleCloseTab}
        title="Complex Data View"
        width={350}
      >
        {renderComplexData()}
      </SlideTab>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  openButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: Colors.light.background + '20',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
});

export default SlideTabExample;
