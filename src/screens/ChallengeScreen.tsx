import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAlarm } from '../contexts/AlarmContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { challengeTemplates } from '../data/challenges';

export default function ChallengeScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { challenge } = route.params;
  const { completeChallenge, session } = useAlarm();
  const [completed, setCompleted] = useState(false);

  const renderChallenge = () => {
    switch (challenge.type) {
      case 'math':
        return <MathChallenge challenge={challenge} onComplete={handleComplete} />;
      case 'recopy':
        return <RecopyChallenge challenge={challenge} onComplete={handleComplete} />;
      case 'scanner':
        return <ScannerChallenge challenge={challenge} onComplete={handleComplete} />;
      case 'photo':
        return <PhotoChallenge challenge={challenge} onComplete={handleComplete} />;
      case 'movement':
        return <MovementChallenge challenge={challenge} onComplete={handleComplete} />;
      case 'location':
        return <LocationChallenge challenge={challenge} onComplete={handleComplete} />;
      default:
        return <CustomChallenge challenge={challenge} onComplete={handleComplete} />;
    }
  };

  const handleComplete = async () => {
    setCompleted(true);
    await completeChallenge(challenge.id);
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const progress = session
    ? `${session.challenges.filter(c => c.completed).length + 1} / ${session.challenges.length}`
    : '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progress}>Defi {progress}</Text>
        <Text style={styles.title}>{challenge.name}</Text>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
          <Text style={styles.difficultyText}>{getDifficultyLabel(challenge.difficulty)}</Text>
        </View>
      </View>

      {completed ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>Defi reussi !</Text>
          <Text style={styles.successSubtext}>Alarme desactivee</Text>
        </View>
      ) : (
        <View style={styles.challengeContainer}>
          {renderChallenge()}
        </View>
      )}
    </View>
  );
}

function getDifficultyColor(d: string) {
  switch (d) {
    case 'easy': return '#22c55e';
    case 'medium': return '#f59e0b';
    case 'hard': return '#ef4444';
    default: return '#3b82f6';
  }
}

function getDifficultyLabel(d: string) {
  switch (d) {
    case 'easy': return 'Facile';
    case 'medium': return 'Moyen';
    case 'hard': return 'Difficile';
    default: return d;
  }
}

function MathChallenge({ challenge, onComplete }: { challenge: any; onComplete: () => void }) {
  const [answer, setAnswer] = useState('');
  const [problem, setProblem] = useState(() => {
    const template = challengeTemplates.math[challenge.difficulty as 'easy' | 'medium' | 'hard'];
    return template.getProblem();
  });
  const [error, setError] = useState('');

  const checkAnswer = () => {
    if (parseInt(answer) === problem.answer) {
      onComplete();
    } else {
      setError('Mauvaise reponse. Essayez encore.');
      setAnswer('');
    }
  };

  const newProblem = () => {
    const template = challengeTemplates.math[challenge.difficulty as 'easy' | 'medium' | 'hard'];
    setProblem(template.getProblem());
    setAnswer('');
    setError('');
  };

  return (
    <View style={styles.challengeContent}>
      <Card>
        <Text style={styles.problemText}>{problem.text} = ?</Text>
        <TextInput
          style={styles.input}
          value={answer}
          onChangeText={setAnswer}
          keyboardType="number-pad"
          placeholder="Reponse"
          placeholderTextColor="#64748b"
          autoFocus
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.buttonRow}>
          <Button title="Nouveau calcul" variant="secondary" onPress={newProblem} />
          <Button title="Valider" onPress={checkAnswer} />
        </View>
      </Card>
    </View>
  );
}

function RecopyChallenge({ challenge, onComplete }: { challenge: any; onComplete: () => void }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const template = challengeTemplates.recopy[challenge.difficulty as 'easy' | 'medium' | 'hard'];
  const targetText = template.texts[Math.floor(Math.random() * template.texts.length)];

  const checkRecopy = () => {
    const normalizedInput = input.toLowerCase().replace(/\s+/g, ' ').trim();
    const normalizedTarget = targetText.toLowerCase().replace(/\s+/g, ' ').trim();
    if (normalizedInput === normalizedTarget) {
      onComplete();
    } else {
      setError('Le texte ne correspond pas. Essayez encore.');
      setInput('');
    }
  };

  return (
    <View style={styles.challengeContent}>
      <Card>
        <Text style={styles.recopyLabel}>Recopiez ce texte :</Text>
        <Text style={styles.recopyTarget}>"{targetText}"</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={input}
          onChangeText={setInput}
          placeholder="Ecrivez ici..."
          placeholderTextColor="#64748b"
          multiline
          numberOfLines={4}
          autoFocus
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button title="Valider" onPress={checkRecopy} />
      </Card>
    </View>
  );
}

function ScannerChallenge({ challenge, onComplete }: { challenge: any; onComplete: () => void }) {
  return (
    <View style={styles.challengeContent}>
      <Card>
        <Text style={styles.placeholderTitle}>Scanner un objet</Text>
        <Text style={styles.placeholderText}>
          Ouvrez la camera et filmez l'objet cible pour le reconnaitre.
        </Text>
        <Text style={styles.comingSoon}>Fonctionnalite camera - Integration IA prevue</Text>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.cameraText}>Camera</Text>
        </View>
        <Button title="Simuler la reconnaissance" variant="success" onPress={onComplete} />
      </Card>
    </View>
  );
}

function PhotoChallenge({ challenge, onComplete }: { challenge: any; onComplete: () => void }) {
  return (
    <View style={styles.challengeContent}>
      <Card>
        <Text style={styles.placeholderTitle}>Prendre une photo</Text>
        <Text style={styles.placeholderText}>
          Prenez une photo de l'objet ou du lieu demande.
        </Text>
        <Text style={styles.comingSoon}>Fonctionnalite camera - Integration IA prevue</Text>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraIcon}>📸</Text>
          <Text style={styles.cameraText}>Photo</Text>
        </View>
        <Button title="Simuler la photo" variant="success" onPress={onComplete} />
      </Card>
    </View>
  );
}

function MovementChallenge({ challenge, onComplete }: { challenge: any; onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const target = challenge.difficulty === 'easy' ? 5 : challenge.difficulty === 'medium' ? 10 : 20;

  const simulateMovement = () => {
    setCount(c => {
      if (c + 1 >= target) {
        setTimeout(onComplete, 500);
        return target;
      }
      return c + 1;
    });
  };

  return (
    <View style={styles.challengeContent}>
      <Card>
        <Text style={styles.movementTitle}>Effectuez {target} mouvements</Text>
        <View style={styles.progressCircle}>
          <Text style={styles.movementCount}>{count} / {target}</Text>
        </View>
        <View style={styles.movementBar}>
          <View style={[styles.movementFill, { width: `${(count / target) * 100}%` }]} />
        </View>
        <Text style={styles.movementHint}>
          {count === 0 ? 'Appuyez pour simuler un mouvement' : 'Continuez !'}
        </Text>
        <Button title="Simuler mouvement" variant="secondary" onPress={simulateMovement} />
      </Card>
    </View>
  );
}

function LocationChallenge({ challenge, onComplete }: { challenge: any; onComplete: () => void }) {
  const [distance, setDistance] = useState(25);

  const simulateLocation = () => {
    setDistance(prev => {
      if (prev <= 5) {
        setTimeout(onComplete, 500);
        return 0;
      }
      return Math.max(0, prev - 5);
    });
  };

  return (
    <View style={styles.challengeContent}>
      <Card>
        <Text style={styles.locationTitle}>Allez a l'emplacement defini</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.locationDistance}>{distance} m</Text>
          <Text style={styles.locationHint}>Encore {distance} metres</Text>
        </View>
        <View style={styles.locationBar}>
          <View style={[styles.locationFill, { width: `${Math.max(0, 100 - distance)}%` }]} />
        </View>
        <Text style={styles.comingSoon}>GPS - Integration native prevue</Text>
        <Button title="Simuler arrivee" variant="secondary" onPress={simulateLocation} />
      </Card>
    </View>
  );
}

function CustomChallenge({ challenge, onComplete }: { challenge: any; onComplete: () => void }) {
  return (
    <View style={styles.challengeContent}>
      <Card>
        <Text style={styles.placeholderTitle}>Defi personnalise</Text>
        <Text style={styles.placeholderText}>{challenge.name}</Text>
        <Button title="Marquer comme reussi" variant="success" onPress={onComplete} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  progress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
  },
  difficultyBadge: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#22c55e',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 16,
    color: '#94a3b8',
  },
  challengeContainer: {
    flex: 1,
  },
  challengeContent: {
    padding: 16,
  },
  problemText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 24,
    fontVariant: ['tabular-nums'],
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: '#f1f5f9',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  recopyLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
    textAlign: 'center',
  },
  recopyTarget: {
    fontSize: 18,
    color: '#f1f5f9',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 16,
  },
  comingSoon: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  cameraPlaceholder: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    marginBottom: 24,
  },
  cameraIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  cameraText: {
    color: '#64748b',
    fontSize: 14,
  },
  movementTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: '#3b82f6',
  },
  movementCount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  movementBar: {
    height: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  movementFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  movementHint: {
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 24,
  },
  locationContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  locationDistance: {
    fontSize: 48,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  locationHint: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
  },
  locationBar: {
    height: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  locationFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
});
