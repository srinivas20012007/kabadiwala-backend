import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const VoicePriceBoard = ({ navigation }) => {
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  const prices = {
    'Mumbai': {
      'PCB_Circuit_Board': 340,
      'Cables_Wires': 600,
      'Battery': 145,
      'CRT_Monitor_TV': 100,
      'LCD_LED_Panel': 155,
      'Motors_Magnets': 180,
      'Mixed_Plastics': 30
    },
    'Delhi': {
      'PCB_Circuit_Board': 330,
      'Cables_Wires': 580,
      'Battery': 140,
      'CRT_Monitor_TV': 95,
      'LCD_LED_Panel': 148,
      'Motors_Magnets': 175,
      'Mixed_Plastics': 28
    },
    'Bangalore': {
      'PCB_Circuit_Board': 345,
      'Cables_Wires': 610,
      'Battery': 150,
      'CRT_Monitor_TV': 102,
      'LCD_LED_Panel': 160,
      'Motors_Magnets': 185,
      'Mixed_Plastics': 32
    }
  };

  const speakPrice = (category, price) => {
    const msg = `${category} की कीमत ₹${price} प्रति किलो है`;
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const cityPrices = prices[selectedCity] || prices['Mumbai'];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f9ff', padding: 20 }}>
      <View style={{ marginTop: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#3b82f6' }}>🗣️ Price Board</Text>
        <Text style={{ fontSize: 16, color: '#6b7280', marginTop: 5 }}>Today's scrap rates</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        {['Mumbai', 'Delhi', 'Bangalore'].map((city) => (
          <TouchableOpacity
            key={city}
            style={{
              padding: 12,
              borderRadius: 10,
              backgroundColor: selectedCity === city ? '#3b82f6' : 'white',
              borderWidth: 1,
              borderColor: selectedCity === city ? '#3b82f6' : '#e5e7eb'
            }}
            onPress={() => setSelectedCity(city)}
          >
            <Text style={{ color: selectedCity === city ? 'white' : '#1f2937' }}>{city}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {Object.entries(cityPrices).map(([category, price]) => (
        <View key={category} style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, marginTop: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{category}</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#22c55e' }}>₹{price}/kg</Text>
          </View>
          <TouchableOpacity
            style={{ marginTop: 10, backgroundColor: '#8b5cf6', padding: 10, borderRadius: 10, alignItems: 'center' }}
            onPress={() => speakPrice(category, price)}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>🔊 Listen in Hindi</Text>
          </TouchableOpacity>
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

export default VoicePriceBoard;
