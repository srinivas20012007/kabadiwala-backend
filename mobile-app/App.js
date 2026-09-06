import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const tiles = [
    { id: 1, title: '📸 Create Lot', color: '#3b82f6' },
    { id: 2, title: '🔍 Find Recycler', color: '#22c55e' },
    { id: 3, title: '💰 My Earnings', color: '#f59e0b' },
    { id: 4, title: '🗣️ Voice Price', color: '#8b5cf6' },
    { id: 5, title: '🛡️ Safety Guide', color: '#ef4444' },
    { id: 6, title: '📊 Handover', color: '#06b6d4' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f9ff', padding: 16 }}>
      <View style={{ marginTop: 40, marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3b82f6' }}>
          ♻️ Kabadiwala Connect
        </Text>
        <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          Welcome! Let's recycle today.
        </Text>
      </View>

      {tiles.map((tile) => (
        <TouchableOpacity
          key={tile.id}
          style={{
            backgroundColor: tile.color,
            padding: 16,
            borderRadius: 12,
            marginBottom: 10,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => alert(`${tile.title} - Coming Soon!`)}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {tile.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default function App() {
  return <HomeScreen />;
}
