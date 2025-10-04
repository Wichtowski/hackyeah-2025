import React, { useEffect, useRef, useState } from 'react';
import { Alert, View, Text, ActivityIndicator, Pressable } from 'react-native';
import { apiClient, configureApi, enableApiDebug } from '@journey-radar/sdk';

/**
 * API Health Button
 * Placed near the TransportSelector (bottom-right). Uses EXPO_PUBLIC_API_URL if provided.
 */
const ApiHealthButton: React.FC = () => {
  // Enable debug logging if env flag set
  if (process.env.EXPO_PUBLIC_API_DEBUG === '1') {
    enableApiDebug(true);
  }

  const configuredRef = useRef(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [headerTs, setHeaderTs] = useState<string | null>(null);

  useEffect(() => {
    if (configuredRef.current) return;
    const envBase = process.env.EXPO_PUBLIC_API_URL; // e.g. http://192.168.0.42:3000
    if (envBase) {
      const normalized = envBase.replace(/\/$/, '');
      const baseURL = /\/api$/.test(normalized) ? normalized : `${normalized}/api`;
      configureApi({ baseURL });
      configuredRef.current = true;
      console.log(`[ApiHealthButton] Configured API base URL -> ${baseURL}`);
    }
    // Auto-run a check shortly after mount for immediate feedback
    const t = setTimeout(() => handlePress(false), 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePress = async (showAlerts = true) => {
    setStatus('loading');
    try {
      const result = await apiClient.healthCheck();
      console.log('[ApiHealthButton] Health success:', result); // explicit success log
      setStatus('ok');
      setLastMessage(result.message);
      setHeaderTs(result.headerTimestamp || null);
      setLastChecked(new Date());
      if (showAlerts) Alert.alert('Health', `API: ${result.message}`);
    } catch (error) {
      console.error('[ApiHealthButton] Health error:', error); // explicit error log
      setStatus('error');
      setLastMessage('Failed');
      setHeaderTs(null);
      setLastChecked(new Date());
      if (showAlerts) Alert.alert('Error', 'Backend not reachable');
    }
  };

  const color = status === 'ok' ? '#34c759' : status === 'error' ? '#ff3b30' : status === 'loading' ? '#ffcc00' : '#999';

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable
          onPress={() => handlePress(true)}
          style={{
            backgroundColor: '#486db1',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 30,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
            minWidth: 90,
            justifyContent: 'center'
          }}
        >
          {status === 'loading' ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: color }} />
          )}
          <Text style={{ color: 'white', fontWeight: '600' }}>API</Text>
        </Pressable>
      </View>
      <View style={{ marginTop: 4, alignItems: 'center' }}>
        {lastChecked ? (
          <Text style={{ fontSize: 10, color: '#444' }}>
            {status === 'ok' && lastMessage ? `OK (${lastMessage})` : status === 'error' ? 'Error' : 'Idle'} · {(headerTs ? new Date(headerTs).toLocaleTimeString() : lastChecked?.toLocaleTimeString())}
          </Text>
        ) : (
          <Text style={{ fontSize: 10, color: '#666' }}>Waiting…</Text>
        )}
      </View>
    </View>
  );
};

export default ApiHealthButton;
