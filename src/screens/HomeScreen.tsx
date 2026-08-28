import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAlarm } from '../contexts/AlarmContext';
import { Alarm } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { AlarmCard } from '../components/AlarmCard';
import { v4 as uuidv4 } from 'uuid';

const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { alarms, isRinging, testAlarm, stopTest } = useAlarm();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const nextAlarm = alarms
    .filter(a => a.enabled)
    .sort((a, b) => {
      const now = new Date();
      const getNext = (alarm: Alarm) => {
        const d = new Date();
        d.setHours(alarm.hour, alarm.minute, 0, 0);
        if (d <= now) d.setDate(d.getDate() + 1);
        return d.getTime();
      };
      return getNext(a) - getNext(b);
    })[0];

  const formatTime = (date: Date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getActiveDays = (days: number[]) => {
    if (days.length === 7) return 'Tous les jours';
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Lun - Ven';
    return days.map(d => dayLabels[d]).join(' ');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
          <Text style={styles.currentDate}>
            {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>

        {nextAlarm ? (
          <Card style={styles.nextAlarmCard}>
            <Text style={styles.nextAlarmLabel}>PROCHAINE ALARME</Text>
            <Text style={styles.nextAlarmTime}>
              {String(nextAlarm.hour).padStart(2, '0')}:{String(nextAlarm.minute).padStart(2, '0')}
            </Text>
            <Text style={styles.nextAlarmDays}>{getActiveDays(nextAlarm.days)}</Text>
            <View style={styles.challengeList}>
              {nextAlarm.challenges.map(c => (
                <View key={c.id} style={styles.challengeItem}>
                  <Text style={styles.challengeDot}>•</Text>
                  <Text style={styles.challengeName}>{c.name}</Text>
                </View>
              ))}
            </View>
            <View style={styles.nextActions}>
              <Button
                title="Modifier"
                variant="secondary"
                size="small"
                onPress={() => navigation.navigate('EditAlarm', { alarm: nextAlarm })}
              />
              <Button
                title="Tester"
                variant="primary"
                size="small"
                onPress={testAlarm}
              />
            </View>
          </Card>
        ) : (
          <Card style={styles.noAlarmCard}>
            <Text style={styles.noAlarmText}>Aucune alarme configuree</Text>
            <Text style={styles.noAlarmSubtext}>Creez votre premiere alarme pour commencer</Text>
          </Card>
        )}

        <View style={styles.alarmList}>
          <Text style={styles.sectionTitle}>Mes alarmes</Text>
          {alarms.map(alarm => (
            <AlarmCard
              key={alarm.id}
              alarm={alarm}
              onPress={() => navigation.navigate('EditAlarm', { alarm })}
              onToggle={() => useAlarm().updateAlarm(alarm.id, { enabled: !alarm.enabled })}
            />
          ))}
        </View>

        <View style={styles.fab}>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={() => navigation.navigate('CreateAlarm')}
          >
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
  },
  currentTime: {
    fontSize: 72,
    fontWeight: '200',
    color: '#f1f5f9',
    fontVariant: ['tabular-nums'],
  },
  currentDate: {
    fontSize: 16,
    color: '#94a3b8',
    textTransform: 'capitalize',
    marginTop: 8,
  },
  nextAlarmCard: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  nextAlarmLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
    letterSpacing: 1,
    marginBottom: 8,
  },
  nextAlarmTime: {
    fontSize: 56,
    fontWeight: '700',
    color: '#f1f5f9',
    fontVariant: ['tabular-nums'],
  },
  nextAlarmDays: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
    marginBottom: 16,
  },
  challengeList: {
    marginBottom: 16,
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  challengeDot: {
    color: '#3b82f6',
    marginRight: 8,
    fontSize: 16,
  },
  challengeName: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  nextActions: {
    flexDirection: 'row',
    gap: 12,
  },
  noAlarmCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: 'center',
    paddingVertical: 40,
  },
  noAlarmText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  noAlarmSubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
  alarmList: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
    marginTop: -2,
  },
});
