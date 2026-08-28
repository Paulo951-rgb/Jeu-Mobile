import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAlarm } from '../contexts/AlarmContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export default function DeveloperScreen() {
  const navigation = useNavigation<any>();
  const { testAlarm, stopTest, resetSession, alarms } = useAlarm();

  const handleTestAlarm = () => {
    testAlarm();
    Alert.alert('Test', 'Alarme de test lancee');
  };

  const handleStopTest = () => {
    stopTest();
    Alert.alert('Test', 'Test arrete');
  };

  const handleResetSession = async () => {
    await resetSession();
    Alert.alert('Reset', 'Session reinitialisee');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tests rapides</Text>
        <Card>
          <Button title="Lancer alarme de test" onPress={handleTestAlarm} variant="success" />
          <View style={styles.spacer} />
          <Button title="Arreter le test" onPress={handleStopTest} variant="danger" />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session</Text>
        <Card>
          <Button title="Reinitialiser la session" onPress={handleResetSession} variant="secondary" />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permissions</Text>
        <Card>
          <Text style={styles.infoText}>
            Camera: {`\n`}
            Localisation: {`\n`}
            Notifications: {`\n`}
            Capteurs: {`\n`}
          </Text>
          <Text style={styles.infoSubtext}>
            Les permissions sont demandees au moment de l'utilisation de chaque fonctionnalite.
          </Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diagnostics</Text>
        <Card>
          <Text style={styles.infoText}>
            Alarmes: {alarms.length} {`\n`}
            Actives: {alarms.filter(a => a.enabled).length} {`\n`}
          </Text>
        </Card>
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
  spacer: {
    height: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
    fontFamily: 'monospace',
  },
  infoSubtext: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 12,
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    paddingBottom: 40,
  },
});
