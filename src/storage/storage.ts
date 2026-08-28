import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alarm } from '../types';

const ALARMS_KEY = '@wake_challenge:alarms';
const SESSION_KEY = '@wake_challenge:session';
const SETTINGS_KEY = '@wake_challenge:settings';

interface Settings {
  developerMode: boolean;
  theme: 'dark' | 'light';
}

export const storage = {
  async getAlarms(): Promise<Alarm[]> {
    try {
      const data = await AsyncStorage.getItem(ALARMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveAlarms(alarms: Alarm[]): Promise<void> {
    await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
  },

  async getSession() {
    try {
      const data = await AsyncStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async saveSession(session: any): Promise<void> {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  async clearSession(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
  },

  async getSettings(): Promise<Settings> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : { developerMode: false, theme: 'dark' };
    } catch {
      return { developerMode: false, theme: 'dark' };
    }
  },

  async saveSettings(settings: Settings): Promise<void> {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
};
