import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAlarm } from '../contexts/AlarmContext';
import HomeScreen from '../screens/HomeScreen';
import AlarmCreateScreen from '../screens/AlarmCreateScreen';
import AlarmRingingScreen from '../screens/AlarmRingingScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DeveloperScreen from '../screens/DeveloperScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isRinging, session } = useAlarm();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#f1f5f9',
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: '#0f172a' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateAlarm"
          component={AlarmCreateScreen}
          options={{ title: 'Nouvelle alarme' }}
        />
        <Stack.Screen
          name="EditAlarm"
          component={AlarmCreateScreen}
          options={{ title: 'Modifier l\'alarme' }}
        />
        <Stack.Screen
          name="Ringing"
          component={AlarmRingingScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Challenge"
          component={ChallengeScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Parametres' }}
        />
        <Stack.Screen
          name="Developer"
          component={DeveloperScreen}
          options={{ title: 'Mode developpeur' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
