import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const EarningsLedger = ({ navigation }) => {
  const earnings = {
    total: 15780,
    pending: 1200,
    thisMonth: 8750,
    lastMonth: 7030
  };

  const transactions = [
    { id: 1, date: '04 Sep 2026', material: 'PCB_Circuit_Board', amount: 1870, status: 'paid' },
    { id: 2, date: '03 Sep 2026', material: 'Cables_Wires', amount: 2400, status: 'paid' },
    { id: 3, date: '02 Sep 2026', material: 'Battery', amount: 725, status: 'paid' },
    { id: 4, date: '01 Sep 2026', material: 'PCB_Circuit_Board', amount: 1530, status: 'pending' },
    { id: 5, date: '31 Aug 2026', material: 'Motors_Magnets', amount: 925, status: 'paid' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f9ff', padding: 20 }}>
      <View style={{ marginTop: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#3b82f6' }}>💰 Earnings</Text>
        <Text style={{ fontSize: 16, color: '#6b7280', marginTop: 5 }}>Your transaction history</Text>
      </View>

      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 15, marginTop: 20 }}>
        <Text style={{ fontSize: 16, color: '#6b7280' }}>Total Earnings</Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#22c55e' }}>₹{earnings.total}</Text>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#6b7280', fontSize: 12 }}>This Month</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>₹{earnings.thisMonth}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#6b7280', fontSize: 12 }}>Pending</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#f59e0b' }}>₹{earnings.pending}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#6b7280', fontSize: 12 }}>Last Month</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>₹{earnings.lastMonth}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Recent Transactions</Text>
        {transactions.map((tx) => (
          <View key={tx.id} style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, marginTop: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontWeight: 'bold' }}>{tx.material}</Text>
                <Text style={{ color: '#6b7280', fontSize: 12 }}>{tx.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontWeight: 'bold', color: '#22c55e' }}>₹{tx.amount}</Text>
                <Text style={{ fontSize: 12, color: tx.status === 'paid' ? '#22c55e' : '#f59e0b' }}>
                  {tx.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={{ marginTop: 20, padding: 15, borderRadius: 10, alignItems: 'center' }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: '#6b7280' }}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EarningsLedger;
