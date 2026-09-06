import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const LotCreator = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState(null);
  const [weight, setWeight] = useState('');
  const [step, setStep] = useState('camera');

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Simulate AI detection
      const categories = ['PCB_Circuit_Board', 'Cables_Wires', 'Battery', 'CRT_Monitor_TV', 'LCD_LED_Panel', 'Motors_Magnets', 'Mixed_Plastics'];
      const detected = categories[Math.floor(Math.random() * categories.length)];
      setCategory(detected);
      setStep('weight');
    }
  };

  const handleWeightEntry = (value) => {
    setWeight(value);
  };

  const createLot = () => {
    if (!weight || parseFloat(weight) <= 0) {
      Alert.alert('Error', 'Please enter valid weight');
      return;
    }
    Alert.alert(
      '✅ Lot Created!',
      `Category: ${category}\nWeight: ${weight} kg\nPrice: ₹${parseFloat(weight) * 300}`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  if (step === 'camera') {
    return (
      <View style={{ flex: 1, backgroundColor: '#f0f9ff', padding: 20, justifyContent: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#3b82f6', textAlign: 'center' }}>📸 Scan Scrap</Text>
        <Text style={{ fontSize: 16, color: '#6b7280', textAlign: 'center', marginTop: 10, marginBottom: 30 }}>
          Take a photo of your scrap to identify it
        </Text>

        <TouchableOpacity
          style={{ backgroundColor: '#3b82f6', padding: 20, borderRadius: 15, alignItems: 'center' }}
          onPress={pickImage}
        >
          <Text style={{ fontSize: 48 }}>📷</Text>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 15, padding: 15, borderRadius: 10, alignItems: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#6b7280' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'weight') {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#f0f9ff', padding: 20 }}>
        {image && (
          <Image source={{ uri: image }} style={{ width: '100%', height: 200, borderRadius: 15, marginBottom: 15 }} />
        )}

        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Detected: {category}</Text>
          <Text style={{ color: '#6b7280', marginTop: 5 }}>AI Confidence: 96%</Text>
        </View>

        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 15, marginTop: 15 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>⚖️ Enter Weight (kg)</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {[1, 2, 5, 10, 20, 50].map((w) => (
              <TouchableOpacity
                key={w}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: weight === w.toString() ? '#3b82f6' : '#e5e7eb',
                  minWidth: 60,
                  alignItems: 'center'
                }}
                onPress={() => handleWeightEntry(w.toString())}
              >
                <Text style={{ color: weight === w.toString() ? 'white' : '#1f2937', fontWeight: 'bold' }}>{w} kg</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={{ backgroundColor: '#22c55e', padding: 18, borderRadius: 15, marginTop: 20 }}
          onPress={createLot}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 18 }}>
            ✅ Create Lot
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return null;
};

export default LotCreator;
