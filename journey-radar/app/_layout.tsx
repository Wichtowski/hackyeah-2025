import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { configureApi, enableApiDebug } from '@journey-radar/sdk';
import { RouteProvider } from '@/contexts/RouteContext';
import { JourneyProvider } from '@/contexts/JourneyContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Configure API on app startup
  useEffect(() => {
    const envBase = process.env.EXPO_PUBLIC_API_URL; // e.g. http://192.168.0.42:3000
    
    if (process.env.EXPO_PUBLIC_API_DEBUG === '1') {
      enableApiDebug(true);
    }

    if (envBase) {
      const normalized = envBase.replace(/\/$/, '');
      const baseURL = /\/api$/.test(normalized) ? normalized : `${normalized}/api`;
      configureApi({ baseURL });
      console.log(`[App] Configured API base URL -> ${baseURL}`);
    } else {
      // Default to localhost for development
      configureApi({ baseURL: 'http://localhost:3000/api' });
      console.log('[App] Using default API URL: http://localhost:3000/api');
    }
  }, []);

  return (
    <RouteProvider>
      <JourneyProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </JourneyProvider>
    </RouteProvider>
  );
}
