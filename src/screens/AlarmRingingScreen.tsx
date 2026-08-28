import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAlarm } from '../contexts/AlarmContext';
import { Button } from '../components/Button';
import { Alert } from 'react-native';

export default function AlarmRingingScreen() {
  const navigation = useNavigation<any>();
  const { alarms, session, stopAlarm, nextChallenge } = useAlarm();
  const [pulseAnim] = useState(new Animated.Value(1));

  const alarm = alarms.find(a => a.id === session?.alarmId);
  const next = session ? nextChallenge() : null;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const goToChallenge = () => {
    if (next) {
      navigation.navigate('Challenge', { challenge: next });
    }
  };

  const handleEmergencyStop = () => {
    Alert.alert(
      'Arret d\'urgence',
      'Voulez-vous vraiment arreter l\'alarme ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Arreter', style: 'destructive', onPress: stopAlarm },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ringContainer, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.ring} />
      </Animated.View>

      <Text style={styles.time}>
        {alarm ? `${String(alarm.hour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')}` : '07:00'}
      </Text>
      <Text style={styles.label}>{alarm?.label || 'DEBOUT !'}</Text>

      <View style={styles.statusBadge}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>ALARME ACTIVE</Text>
      </View>

      {session && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Defi {session.challenges.filter(c => c.completed).length + 1} / {session.challenges.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(session.challenges.filter(c => c.completed).length / session.challenges.length) * 100}%` },
              ]}
            />
          </View>
        </View>
      )}

      {next && (
        <View style={styles.nextChallengeContainer}>
          <Text style={styles.nextChallengeLabel}>Prochain defi</Text>
          <Text style={styles.nextChallengeName}>{next.name}</Text>
          <Button title="Resoudre le defi" onPress={goToChallenge} variant="success" size="large" />
        </View>
      )}

      <TouchableOpacity style={styles.emergencyBtn} onPress={handleEmergencyStop}>
        <Text style={styles.emergencyText}>Arret d'urgence</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  ringContainer: {
    marginBottom: 40,
  },
  ring: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    borderWidth: 8,
    borderColor: '#ef4444',
    opacity: 0.3,
  },
  time: {
    fontSize: 96,
    fontWeight: '200',
    color: '#f1f5f9',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ef4444',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ef4444',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 2,
  },
  progressContainer: {
    width: '100%',
    marginTop: 40,
  },
  progressText: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  nextChallengeContainer: {
    marginTop: 48,
    alignItems: 'center',
  },
  nextChallengeLabel: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 8,
  },
  nextChallengeName: {
    color: '#f1f5f9',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  emergencyBtn: {
    marginTop: 'auto',
    marginBottom: 40,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  emergencyText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
});
