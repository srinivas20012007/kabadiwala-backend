import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const RecyclerFinder = ({ navigation }) => {
  const [recyclers] = useState([
    {
      id: 1,
      name: 'GreenEco Recyclers',
      location: 'Mumbai',
      rating: 4.8,
      verified: true,
      pickup: true,
      rate: '₹340/kg'
    },
    {
      id: 2,
      name: 'EcoCycle Solutions',
      location: 'Delhi',
      rating: 4.5,
      verified: true,
      pickup: false,
      rate: '₹330/kg'
    },
    {
      id: 3,
      name: 'WasteWise Recyclers',
      location: 'Bangalore',
      rating: 4.7,
      verified: true,
      pickup: true,
      rate: '₹345/kg'
    },
    {
      id: 4,
      name: 'Green Planet Recycling',
      location: 'Mumbai',
      rating: 4.2,
      verified: false,
      pickup: true,
      rate: '₹320/kg'
    }
  ]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f9ff', padding: 20 }}>
      <View style={{ marginTop: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#3b82f6' }}>🔍 Recyclers</Text>
        <Text style={{ fontSize: 16, color: '#6b7280', marginTop: 5 }}>Find verified recyclers near you</Text>
      </View>

      {recyclers.map((recycler) => (
        <View key={recycler.id} style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, marginTop: 15 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{recycler.name}</Text>
            {recycler.verified && <Text style={{ color: '#22c55e' }}>✅ Verified</Text>}
          </View>
          <Text style={{ color: '#6b7280', marginTop: 5 }}>📍 {recycler.location}</Text>
          <Text style={{ color: '#6b7280' }}>⭐ {recycler.rating} / 5</Text>
          <Text style={{ color: '#3b82f6', fontWeight: 'bold', marginTop: 5 }}>{recycler.rate}</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            {recycler.pickup && (
              <View style={{ backgroundColor: '#dbeafe', padding: 5, borderRadius: 5 }}>
                <Text style={{ color: '#3b82f6', fontSize: 12 }}>🚚 Pickup Available</Text>
              </View>
            )}
            <TouchableOpacity
              style={{ backgroundColor: '#3b82f6', padding: 8, borderRadius: 8, flex: 1, alignItems: 'center' }}
              onPress={() => alert(`Contact ${recycler.name}`)}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={{ marginTop: 20, padding: 15, borderRadius: 10, alignItems: 'center' }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: '#6b7280' }}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RecyclerFinder;
