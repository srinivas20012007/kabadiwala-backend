import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const Dashboard = ({ navigation }) => {
  const tiles = [
    { id: 1, title: '📸 Create Lot', color: '#3b82f6', screen: 'LotCreator' },
    { id: 2, title: '🔍 Find Recycler', color: '#22c55e', screen: 'RecyclerFinder' },
    { id: 3, title: '💰 My Earnings', color: '#f59e0b', screen: 'EarningsLedger' },
    { id: 4, title: '🗣️ Voice Price', color: '#8b5cf6', screen: 'VoicePriceBoard' },
    { id: 5, title: '🛡️ Safety Guide', color: '#ef4444', screen: 'SafetyGuidance' },
    { id: 6, title: '📊 Handover', color: '#06b6d4', screen: 'HandoverReceipt' },
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
          onPress={() => navigation.navigate(tile.screen)}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {tile.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Dashboard;
