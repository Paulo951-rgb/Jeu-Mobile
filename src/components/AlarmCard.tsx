import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Alarm } from '../types';

const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

interface AlarmCardProps {
  alarm: Alarm;
  onPress: () => void;
  onToggle: () => void;
}

export function AlarmCard({ alarm, onPress, onToggle }: AlarmCardProps) {
  const activeDays = alarm.days.map(d => dayLabels[d]).join(' ');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.time}>
          {String(alarm.hour).padStart(2, '0')}:{String(alarm.minute).padStart(2, '0')}
        </Text>
        <TouchableOpacity onPress={onToggle} style={[styles.toggle, alarm.enabled && styles.toggleActive]}>
          <View style={[styles.toggleKnob, alarm.enabled && styles.toggleKnobActive]} />
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>{alarm.label || 'Alarme'}</Text>
      <Text style={styles.days}>{activeDays}</Text>
      <View style={styles.footer}>
        <Text style={styles.challenges}>
          {alarm.challenges.length} defi{alarm.challenges.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  time: {
    fontSize: 48,
    fontWeight: '700',
    color: '#f1f5f9',
    fontVariant: ['tabular-nums'],
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#475569',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  toggleActive: {
    backgroundColor: '#3b82f6',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleKnobActive: {
    transform: [{ translateX: 0 }],
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  days: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challenges: {
    fontSize: 14,
    color: '#64748b',
  },
});
