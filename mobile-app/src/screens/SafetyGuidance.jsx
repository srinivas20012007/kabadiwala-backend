import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const SafetyGuidance = ({ navigation }) => {
  const safetyTips = [
    { icon: '🔋', title: 'Battery Safety', tip: 'Do not puncture or crush batteries. Store in cool, dry place.' },
    { icon: '🖥️', title: 'CRT Monitor Safety', tip: 'CRT contains lead and mercury. Handle with care. Do not break.' },
    { icon: '🔌', title: 'Cable Safety', tip: 'Do not burn cables. Burning releases toxic gases.' },
    { icon: '⚠️', title: 'PCB Handling', tip: 'Wear gloves when handling PCBs. Wash hands after.' },
    { icon: '🧯', title: 'Fire Safety', tip: 'Keep fire extinguisher nearby. Store batteries away from flammable materials.' },
    { icon: '🥤', title: 'Chemical Safety', tip: 'Avoid contact with chemicals. Use protective equipment.' },
  ];

  const speakTip = (tip) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(tip);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f9ff', padding: 20 }}>
      <View style={{ marginTop: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#ef4444' }}>🛡️ Safety Guide</Text>
        <Text style={{ fontSize: 16, color: '#6b7280', marginTop: 5 }}>Stay safe while handling scrap</Text>
      </View>

      {safetyTips.map((item, index) => (
        <View key={index} style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, marginTop: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 32 }}>{item.icon}</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>{item.title}</Text>
          </View>
          <Text style={{ color: '#6b7280', marginTop: 10, lineHeight: 22 }}>{item.tip}</Text>
          <TouchableOpacity
            style={{ marginTop: 10, backgroundColor: '#ef4444', padding: 10, borderRadius: 10, alignItems: 'center' }}
            onPress={() => speakTip(item.tip)}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>🔊 Listen in Hindi</Text>
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

export default SafetyGuidance;
