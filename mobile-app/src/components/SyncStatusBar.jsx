import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const SyncStatusBar = () => {
  const [status, setStatus] = useState('synced');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setStatus('syncing');
      setTimeout(() => setStatus('synced'), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const statusConfig = {
    offline: { color: '#ef4444', label: '🔴 Offline', emoji: '🔄' },
    syncing: { color: '#f59e0b', label: '🟡 Syncing...', emoji: '🔄' },
    synced: { color: '#22c55e', label: '🟢 Synced', emoji: '✅' },
  };

  const current = statusConfig[status];

  return (
    <View style={{
      backgroundColor: current.color,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        {current.emoji} {current.label}
      </Text>
      <Text style={{ color: 'white', fontSize: 12 }}>
        {isOnline ? '📶 Online' : '📡 Offline'}
      </Text>
    </View>
  );
};

export default SyncStatusBar;
