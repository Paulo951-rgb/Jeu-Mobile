import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, LogBox } from 'react-native';
import { AlarmProvider } from './src/contexts/AlarmContext';
import AppNavigator from './src/navigation/AppNavigator';

LogBox.ignoreAllLogs(true);

export default function App() {
  return (
    <AlarmProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <AppNavigator />
      </View>
    </AlarmProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
