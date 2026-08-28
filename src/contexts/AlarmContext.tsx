import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Alarm, AlarmSession, Challenge } from '../types';
import { storage } from '../storage/storage';
import { audio } from '../utils/audio';
import { scheduleAlarmNotification, cancelAlarmNotification, cancelAllNotifications, setupNotificationChannels, requestNotificationPermissions } from '../utils/notifications';
import { v4 as uuidv4 } from 'uuid';

interface AlarmContextType {
  alarms: Alarm[];
  session: AlarmSession | null;
  isRinging: boolean;
  loading: boolean;
  addAlarm: (alarm: Omit<Alarm, 'id'>) => Promise<Alarm>;
  updateAlarm: (id: string, updates: Partial<Alarm>) => Promise<void>;
  deleteAlarm: (id: string) => Promise<void>;
  triggerAlarm: (alarmId: string) => Promise<void>;
  stopAlarm: () => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<Challenge | null>;
  nextChallenge: () => Challenge | null;
  resetSession: () => Promise<void>;
  testAlarm: () => Promise<void>;
  stopTest: () => Promise<void>;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export function AlarmProvider({ children }: { children: React.ReactNode }) {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [session, setSession] = useState<AlarmSession | null>(null);
  const [isRinging, setIsRinging] = useState(false);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const savedAlarms = await storage.getAlarms();
      setAlarms(savedAlarms);
      const savedSession = await storage.getSession();
      if (savedSession && !savedSession.completed) {
        setSession(savedSession);
        setIsRinging(true);
      }
      await requestNotificationPermissions();
      setupNotificationChannels();
      setLoading(false);
    };

    init();
  }, []);

  const addAlarm = useCallback(async (alarmData: Omit<Alarm, 'id'>): Promise<Alarm> => {
    const alarm: Alarm = { ...alarmData, id: uuidv4() };
    const newAlarms = [...alarms, alarm];
    setAlarms(newAlarms);
    await storage.saveAlarms(newAlarms);
    if (alarm.enabled) {
      await scheduleAlarmNotification(alarm);
    }
    return alarm;
  }, [alarms]);

  const updateAlarm = useCallback(async (id: string, updates: Partial<Alarm>) => {
    const newAlarms = alarms.map(a => a.id === id ? { ...a, ...updates } : a);
    setAlarms(newAlarms);
    await storage.saveAlarms(newAlarms);
    const alarm = newAlarms.find(a => a.id === id);
    if (alarm) {
      if (updates.enabled === false) {
        // Cancel old notification
      } else if (alarm.enabled) {
        await cancelAllNotifications();
        for (const a of newAlarms.filter(a => a.enabled)) {
          await scheduleAlarmNotification(a);
        }
      }
    }
  }, [alarms]);

  const deleteAlarm = useCallback(async (id: string) => {
    const newAlarms = alarms.filter(a => a.id !== id);
    setAlarms(newAlarms);
    await storage.saveAlarms(newAlarms);
    await cancelAllNotifications();
    for (const a of newAlarms.filter(a => a.enabled)) {
      await scheduleAlarmNotification(a);
    }
  }, [alarms]);

  const triggerAlarm = useCallback(async (alarmId: string) => {
    const alarm = alarms.find(a => a.id === alarmId);
    if (!alarm) return;

    const newSession: AlarmSession = {
      alarmId: alarm.id,
      startedAt: Date.now(),
      currentChallengeIndex: 0,
      challenges: alarm.challenges.map(c => ({ ...c, completed: false })),
      completed: false,
      snoozeCount: 0,
    };

    setSession(newSession);
    setIsRinging(true);
    await storage.saveSession(newSession);
    await audio.playAlarm();
  }, [alarms]);

  const testAlarm = useCallback(async () => {
    const testAlarm: Alarm = {
      id: 'test',
      label: 'Test Alarm',
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
      days: [0, 1, 2, 3, 4, 5, 6],
      enabled: true,
      vibrate: true,
      volume: 1.0,
      volumeRampDuration: 0,
      challenges: [
        { id: uuidv4(), type: 'math', name: 'Calcul simple', difficulty: 'easy', completed: false, order: 0 },
        { id: uuidv4(), type: 'recopy', name: 'Recopie', difficulty: 'easy', completed: false, order: 1 },
      ],
      snoozeEnabled: false,
      snoozeDuration: 5,
      maxSnoozes: 3,
    };

    const newSession: AlarmSession = {
      alarmId: 'test',
      startedAt: Date.now(),
      currentChallengeIndex: 0,
      challenges: testAlarm.challenges.map(c => ({ ...c, completed: false })),
      completed: false,
      snoozeCount: 0,
    };

    setSession(newSession);
    setIsRinging(true);
    await storage.saveSession(newSession);
    await audio.playAlarm();
  }, []);

  const stopAlarm = useCallback(async () => {
    await audio.stopAlarm();
    setIsRinging(false);
    setSession(null);
    await storage.clearSession();
  }, []);

  const stopTest = useCallback(async () => {
    await stopAlarm();
  }, [stopAlarm]);

  const completeChallenge = useCallback(async (challengeId: string): Promise<Challenge | null> => {
    if (!session) return null;

    const updatedChallenges = session.challenges.map(c =>
      c.id === challengeId ? { ...c, completed: true } : c
    );

    const allCompleted = updatedChallenges.every(c => c.completed);
    const updatedSession = {
      ...session,
      challenges: updatedChallenges,
      completed: allCompleted,
    };

    setSession(updatedSession);
    await storage.saveSession(updatedSession);

    if (allCompleted) {
      await audio.stopAlarm();
      await cancelAllNotifications();
      await storage.clearSession();
    }

    return updatedChallenges.find(c => c.id === challengeId) || null;
  }, [session]);

  const nextChallenge = useCallback((): Challenge | null => {
    if (!session) return null;
    return session.challenges.find(c => !c.completed) || null;
  }, [session]);

  const resetSession = useCallback(async () => {
    await storage.clearSession();
    setSession(null);
    setIsRinging(false);
  }, []);

  return (
    <AlarmContext.Provider
      value={{
        alarms,
        session,
        isRinging,
        loading,
        addAlarm,
        updateAlarm,
        deleteAlarm,
        triggerAlarm,
        stopAlarm,
        completeChallenge,
        nextChallenge,
        resetSession,
        testAlarm,
        stopTest,
      }}
    >
      {children}
    </AlarmContext.Provider>
  );
}

export function useAlarm() {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
}
