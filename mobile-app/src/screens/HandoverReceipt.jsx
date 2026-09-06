import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';

const HandoverReceipt = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);

  const generateOTP = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(newOtp);
    Alert.alert('OTP Generated', `Your OTP is: ${newOtp}`);
  };

  const confirmHandover = () => {
    Alert.alert(
      '✅ Handover Confirmed!',
      'Lot: LOT20260904001\nWeight: 5.5 kg\nTotal: ₹1,870\nRecycler: GreenEco Recyclers',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f9ff', padding: 20 }}>
      <View style={{ marginTop: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#3b82f6' }}>📋 Handover</Text>
        <Text style={{ fontSize: 16, color: '#6b7280', marginTop: 5 }}>Complete your transaction</Text>
      </View>

      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 15, marginTop: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Lot Details</Text>
        <View style={{ marginTop: 10 }}>
          <InfoRow label="Lot ID" value="LOT20260904001" />
          <InfoRow label="Material" value="PCB_Circuit_Board" />
          <InfoRow label="Weight" value="5.5 kg" />
          <InfoRow label="Amount" value="₹1,870" />
          <InfoRow label="Recycler" value="GreenEco Recyclers" />
        </View>
      </View>

      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 15, marginTop: 15 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>🔐 Verification</Text>
        {!otp ? (
          <TouchableOpacity
            style={{ backgroundColor: '#8b5cf6', padding: 15, borderRadius: 10, marginTop: 10, alignItems: 'center' }}
            onPress={generateOTP}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Generate OTP</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#3b82f6', marginTop: 10 }}>
              {otp}
            </Text>
            <Text style={{ textAlign: 'center', color: '#6b7280' }}>Share this OTP with recycler</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={{ backgroundColor: '#22c55e', padding: 18, borderRadius: 15, marginTop: 20 }}
        onPress={confirmHandover}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 18 }}>
          ✅ Confirm Handover
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 10, padding: 15, borderRadius: 10, alignItems: 'center' }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: '#6b7280' }}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
    <Text style={{ color: '#6b7280' }}>{label}</Text>
    <Text style={{ fontWeight: 'bold' }}>{value}</Text>
  </View>
);

export default HandoverReceipt;
