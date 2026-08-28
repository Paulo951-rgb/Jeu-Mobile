import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAlarm } from '../contexts/AlarmContext';
import { Alarm, ChallengeType, ChallengeDifficulty, Challenge } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ChallengeCard } from '../components/ChallengeCard';
import { v4 as uuidv4 } from 'uuid';

const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const challengeTypes: { type: ChallengeType; label: string; icon: string }[] = [
  { type: 'math', label: 'Calcul', icon: '🧮' },
  { type: 'scanner', label: 'Scanner', icon: '📷' },
  { type: 'photo', label: 'Photo', icon: '📸' },
  { type: 'movement', label: 'Mouvement', icon: '🏃' },
  { type: 'recopy', label: 'Recopie', icon: '✍️' },
  { type: 'location', label: 'Localisation', icon: '📍' },
];

const difficulties: { value: ChallengeDifficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Facile', color: '#22c55e' },
  { value: 'medium', label: 'Moyen', color: '#f59e0b' },
  { value: 'hard', label: 'Difficile', color: '#ef4444' },
];

export default function AlarmCreateScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addAlarm, updateAlarm } = useAlarm();
  const isEdit = route.name === 'EditAlarm';
  const existingAlarm = route.params?.alarm;

  const [label, setLabel] = useState(existingAlarm?.label || '');
  const [hour, setHour] = useState(existingAlarm?.hour ?? 7);
  const [minute, setMinute] = useState(existingAlarm?.minute ?? 0);
  const [days, setDays] = useState<number[]>(existingAlarm?.days || [1, 2, 3, 4, 5]);
  const [vibrate, setVibrate] = useState(existingAlarm?.vibrate ?? true);
  const [volume, setVolume] = useState(existingAlarm?.volume ?? 1.0);
  const [volumeRamp, setVolumeRamp] = useState(existingAlarm?.volumeRampDuration ?? 0);
  const [challenges, setChallenges] = useState<Challenge[]>(existingAlarm?.challenges || []);
  const [selectedType, setSelectedType] = useState<ChallengeType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeDifficulty>('medium');

  const toggleDay = (d: number) => {
    setDays(prev => prev.includes(d) ? prev.filter(day => day !== d) : [...prev, d]);
  };

  const addChallenge = () => {
    if (!selectedType) return;
    const template = challengeTypes.find(c => c.type === selectedType);
    const challenge: Challenge = {
      id: uuidv4(),
      type: selectedType,
      name: `${template?.label} ${difficulties.find(d => d.value === selectedDifficulty)?.label || ''}`,
      difficulty: selectedDifficulty,
      completed: false,
      order: challenges.length,
    };
    setChallenges([...challenges, challenge]);
    setSelectedType(null);
  };

  const removeChallenge = (id: string) => {
    setChallenges(challenges.filter(c => c.id !== id).map((c, i) => ({ ...c, order: i })));
  };

  const save = async () => {
    if (days.length === 0) {
      Alert.alert('Erreur', 'Selectionnez au moins un jour');
      return;
    }
    if (challenges.length === 0) {
      Alert.alert('Erreur', 'Ajoutez au moins un defi');
      return;
    }

    const alarmData = {
      label: label || 'Alarme',
      hour,
      minute,
      days,
      enabled: true,
      vibrate,
      volume,
      volumeRampDuration: volumeRamp,
      challenges,
      snoozeEnabled: false,
      snoozeDuration: 5,
      maxSnoozes: 3,
    };

    if (isEdit && existingAlarm) {
      await updateAlarm(existingAlarm.id, alarmData);
    } else {
      await addAlarm(alarmData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Heure</Text>
        <View style={styles.timeRow}>
          <View style={styles.timeInput}>
            <TextInput
              style={styles.timeText}
              value={String(hour).padStart(2, '0')}
              onChangeText={text => setHour(Math.min(23, Math.max(0, parseInt(text) || 0)))}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.timeLabel}>Heure</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeInput}>
            <TextInput
              style={styles.timeText}
              value={String(minute).padStart(2, '0')}
              onChangeText={text => setMinute(Math.min(59, Math.max(0, parseInt(text) || 0)))}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.timeLabel}>Min</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jours</Text>
        <View style={styles.daysRow}>
          {dayLabels.map((label, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dayButton, days.includes(index) && styles.dayButtonActive]}
              onPress={() => toggleDay(index)}
            >
              <Text style={[styles.dayText, days.includes(index) && styles.dayTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Defis</Text>
        {challenges.map(challenge => (
          <View key={challenge.id} style={styles.challengeRow}>
            <ChallengeCard challenge={challenge} />
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeChallenge(challenge.id)}>
              <Text style={styles.removeText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        ))}
        {challenges.length === 0 && (
          <Text style={styles.emptyText}>Aucun defi ajoute</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ajouter un defi</Text>
        <View style={styles.typeRow}>
          {challengeTypes.map(ct => (
            <TouchableOpacity
              key={ct.type}
              style={[styles.typeButton, selectedType === ct.type && styles.typeButtonActive]}
              onPress={() => setSelectedType(ct.type)}
            >
              <Text style={styles.typeIcon}>{ct.icon}</Text>
              <Text style={[styles.typeLabel, selectedType === ct.type && styles.typeLabelActive]}>
                {ct.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedType && (
          <View style={styles.difficultyRow}>
            {difficulties.map(d => (
              <TouchableOpacity
                key={d.value}
                style={[styles.diffButton, selectedDifficulty === d.value && { backgroundColor: d.color }]}
                onPress={() => setSelectedDifficulty(d.value)}
              >
                <Text style={[styles.diffText, selectedDifficulty === d.value && styles.diffTextActive]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
            <Button title="Ajouter" variant="primary" size="small" onPress={addChallenge} />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Volume</Text>
        <View style={styles.volumeRow}>
          <Text style={styles.volumeLabel}>Faible</Text>
          <View style={styles.volumeBar}>
            <View style={[styles.volumeFill, { width: `${volume * 100}%` }]} />
          </View>
          <Text style={styles.volumeLabel}>Fort</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button title="Enregistrer" onPress={save} variant="success" />
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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInput: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 64,
    fontWeight: '200',
    color: '#f1f5f9',
    fontVariant: ['tabular-nums'],
    minWidth: 100,
    textAlign: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  timeSeparator: {
    fontSize: 64,
    fontWeight: '200',
    color: '#64748b',
    marginHorizontal: 16,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  dayButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  dayTextActive: {
    color: '#fff',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  typeButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a5f',
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  typeLabelActive: {
    color: '#f1f5f9',
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  diffButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  diffText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 14,
  },
  diffTextActive: {
    color: '#fff',
  },
  challengeRow: {
    marginBottom: 8,
  },
  emptyText: {
    color: '#64748b',
    fontStyle: 'italic',
  },
  removeBtn: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  removeText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volumeLabel: {
    color: '#64748b',
    fontSize: 12,
    width: 40,
  },
  volumeBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  actions: {
    padding: 16,
    paddingBottom: 40,
  },
});
