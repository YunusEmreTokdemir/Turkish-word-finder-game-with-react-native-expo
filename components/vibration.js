import { Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VIBRATION_KEY = 'vibrationEnabled';

export const enableVibration = async () => {
  await AsyncStorage.setItem(VIBRATION_KEY, 'true');
};

export const disableVibration = async () => {
  await AsyncStorage.setItem(VIBRATION_KEY, 'false');
};

export const isVibrationEnabled = async () => {
  const value = await AsyncStorage.getItem(VIBRATION_KEY);
  return value === 'true';
};

export const vibrate = async (pattern = 500) => {
  const enabled = await isVibrationEnabled();
  if (enabled) {
    Vibration.vibrate(pattern);
  }
};
