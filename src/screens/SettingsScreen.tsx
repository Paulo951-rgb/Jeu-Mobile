import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAlarm } from '../contexts/AlarmContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { alarms, resetSession } = useAlarm();

  const clearAllData = async () => {
    Alert.alert(
      'Reinitialiser',
      'Voulez-vous supprimer toutes les alarmes ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            // This would need to be implemented with deleteAlarm for each
            Alert.alert('Info', 'Fonctionnalite de suppression en cours');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <Card>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingValue}>Activees</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Alarmes actives</Text>
            <Text style={styles.settingValue}>{alarms.filter(a => a.enabled).length}</Text>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Donnees</Text>
        <Card>
          <TouchableOpacity style={styles.settingRow} onPress={clearAllData}>
            <Text style={[styles.settingLabel, styles.dangerText]}>Reinitialiser les donnees</Text>
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>A propos</Text>
        <Card>
          <Text style={styles.aboutText}>Wake Challenge v1.0.0</Text>
          <Text style={styles.aboutSubtext}>Application de reveil par defis</Text>
          <Text style={styles.aboutSubtext}>Developpe avec Expo + React Native</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Button
          title="Mode developpeur"
          variant="secondary"
          onPress={() => navigation.navigate('Developer')}
        />
      </View>

      <View style={styles.footer}>
        <Button title="Retour" variant="secondary" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#f1f5f9',
  },
  settingValue: {
    fontSize: 16,
    color: '#94a3b8',
  },
  dangerText: {
    color: '#ef4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 8,
  },
  aboutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  aboutSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  footer: {
    padding: 16,
    paddingBottom: 40,
  },
});
