import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { SlideTabProps } from '@/types/slide-tab';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SlideTab: React.FC<SlideTabProps> = ({
  visible,
  onClose,
  children,
  title = 'Details',
  width = SCREEN_WIDTH * 0.7,
}) => {
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(width);
  const backdropOpacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const isAnimating = useSharedValue(false);

  useEffect(() => {
    if (visible) {
      isAnimating.value = false;
      translateX.value = withTiming(0, { duration: 300 });
      backdropOpacity.value = withTiming(0.5, { duration: 300 });
      scale.value = withTiming(1, { duration: 300 });
    } else {
      translateX.value = withTiming(width, { duration: 300 });
      backdropOpacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.95, { duration: 300 });
    }
  }, [visible, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const animateClose = (): void => {
    if (isAnimating.value) return;
    
    isAnimating.value = true;
    translateX.value = withTiming(width, { duration: 300 });
    backdropOpacity.value = withTiming(0, { duration: 300 });
    scale.value = withTiming(0.95, { duration: 300 }, () => {
    scheduleOnRN(() => onClose());
    });
  };

  const handleBackdropPress = (): void => {
    animateClose();
  };

  const handleClosePress = (): void => {
    animateClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      
      <View style={styles.container}>
        <Animated.View
          style={[styles.backdrop, backdropAnimatedStyle]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={handleBackdropPress}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.tabContainer,
            { width, paddingTop: insets.top },
            animatedStyle,
          ]}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Animated.Text style={[styles.title, { color: Colors.light.text }]}>
                {title}
              </Animated.Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClosePress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={Colors.light.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  tabContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    boxShadow: '-2px 0px 8px rgba(0, 0, 0, 0.25)',
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.icon + '20',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});

export default SlideTab;
