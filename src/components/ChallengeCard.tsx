import { View, Text, StyleSheet } from 'react-native';
import { Challenge } from '../types';

const difficultyColors = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#ef4444',
};

const difficultyLabels = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
};

interface ChallengeCardProps {
  challenge: Challenge;
  onPress?: () => void;
  showStatus?: boolean;
}

export function ChallengeCard({ challenge, onPress, showStatus }: ChallengeCardProps) {
  return (
    <View style={[styles.container, onPress && styles.pressable]}>
      <View style={[styles.badge, { backgroundColor: difficultyColors[challenge.difficulty] }]}>
        <Text style={styles.badgeText}>{difficultyLabels[challenge.difficulty]}</Text>
      </View>
      <Text style={styles.name}>{challenge.name}</Text>
      {showStatus && (
        <View style={[styles.status, challenge.completed && styles.statusCompleted]}>
          <Text style={[styles.statusText, challenge.completed && styles.statusTextCompleted]}>
            {challenge.completed ? 'Termine' : 'A faire'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressable: {
    marginVertical: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#f1f5f9',
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#334155',
  },
  statusCompleted: {
    backgroundColor: '#22c55e',
  },
  statusText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextCompleted: {
    color: '#fff',
  },
});
