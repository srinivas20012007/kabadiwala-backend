import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Onboarding from './src/screens/Onboarding';
import Dashboard from './src/screens/Dashboard';
import LotCreator from './src/screens/LotCreator';
import VoicePriceBoard from './src/screens/VoicePriceBoard';
import RecyclerFinder from './src/screens/RecyclerFinder';
import HandoverReceipt from './src/screens/HandoverReceipt';
import EarningsLedger from './src/screens/EarningsLedger';
import SafetyGuidance from './src/screens/SafetyGuidance';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Home" component={Dashboard} />
        <Stack.Screen name="LotCreator" component={LotCreator} />
        <Stack.Screen name="VoicePriceBoard" component={VoicePriceBoard} />
        <Stack.Screen name="RecyclerFinder" component={RecyclerFinder} />
        <Stack.Screen name="HandoverReceipt" component={HandoverReceipt} />
        <Stack.Screen name="EarningsLedger" component={EarningsLedger} />
        <Stack.Screen name="SafetyGuidance" component={SafetyGuidance} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}