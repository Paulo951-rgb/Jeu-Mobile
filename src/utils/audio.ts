import { Audio } from 'expo-av';

let alarmSound: Audio.Sound | null = null;
let isPlaying = false;

export const audio = {
  async loadAlarmSound(): Promise<void> {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/alarm.mp3'),
        { shouldPlay: false, isLooping: true },
        (status) => {
          if (status.isLoaded && !status.isPlaying && isPlaying) {
            sound.playAsync().catch(() => {});
          }
        }
      );
      alarmSound = sound;
    } catch (error) {
      console.log('Error loading alarm sound:', error);
    }
  },

  async playAlarm(): Promise<void> {
    if (!alarmSound) {
      await this.loadAlarmSound();
    }
    if (alarmSound) {
      try {
        isPlaying = true;
        const status = await alarmSound.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) {
          await alarmSound.playAsync();
        }
      } catch (error) {
        console.log('Error playing alarm:', error);
      }
    }
  },

  async stopAlarm(): Promise<void> {
    isPlaying = false;
    if (alarmSound) {
      try {
        await alarmSound.stopAsync();
      } catch (error) {
        console.log('Error stopping alarm:', error);
      }
    }
  },

  async setAlarmVolume(volume: number): Promise<void> {
    if (alarmSound) {
      try {
        await alarmSound.setVolumeAsync(volume);
      } catch (error) {
        console.log('Error setting volume:', error);
      }
    }
  },

  async unloadAlarmSound(): Promise<void> {
    if (alarmSound) {
      try {
        await alarmSound.unloadAsync();
        alarmSound = null;
      } catch (error) {
        console.log('Error unloading alarm:', error);
      }
    }
  },
};
