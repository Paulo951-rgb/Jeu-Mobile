import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Alarm } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return false;
    }
  }
  return true;
}

export async function scheduleAlarmNotification(alarm: Alarm): Promise<string | null> {
  if (!alarm.enabled) return null;

  const now = new Date();
  const trigger = new Date();
  trigger.setHours(alarm.hour, alarm.minute, 0, 0);

  if (trigger <= now) {
    trigger.setDate(trigger.getDate() + 1);
  }

  const dayMatch = alarm.days.includes(trigger.getDay());
  if (!dayMatch) {
    const nextDay = new Date(trigger);
    for (let i = 1; i <= 7; i++) {
      nextDay.setDate(trigger.getDate() + i);
      if (alarm.days.includes(nextDay.getDay())) {
        nextDay.setHours(alarm.hour, alarm.minute, 0, 0);
        break;
      }
    }
    trigger.setTime(nextDay.getTime());
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Wake Challenge',
      body: alarm.label || 'Debout ! Relevez vos defis !',
      sound: alarm.soundName || 'default',
      priority: Notifications.AndroidNotificationPriority.HIGH,
      categoryIdentifier: 'ALARM',
    },
    trigger: trigger as any,
  });

  return identifier;
}

export async function cancelAlarmNotification(identifier: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function setupNotificationChannels(): void {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('alarm', {
      name: 'Alarmes',
      importance: Notifications.AndroidImportance.MAX,
      bypassDnd: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      sound: 'default',
    });
  }
}
