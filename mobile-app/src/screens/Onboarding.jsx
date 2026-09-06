import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f0f9ff' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#3b82f6', textAlign: 'center', marginTop: 40 }}>
        ♻️ Kabadiwala Connect
      </Text>
      <Text style={{ fontSize: 16, color: '#6b7280', textAlign: 'center', marginTop: 10 }}>
        Welcome! You are now part of the formal recycling chain.
      </Text>

      <View style={{ marginTop: 40 }}>
        <TouchableOpacity
          style={{ backgroundColor: '#3b82f6', padding: 18, borderRadius: 10, marginBottom: 15 }}
          onPress={() => alert('Lot Creator Coming Soon!')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 18 }}>
            📸 Create Lot
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#22c55e', padding: 18, borderRadius: 10, marginBottom: 15 }}
          onPress={() => alert('Recycler Finder Coming Soon!')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 18 }}>
            🔍 Find Recycler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#f59e0b', padding: 18, borderRadius: 10, marginBottom: 15 }}
          onPress={() => alert('Earnings Coming Soon!')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 18 }}>
            💰 My Earnings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}