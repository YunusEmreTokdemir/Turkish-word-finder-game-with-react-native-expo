import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import DailyGameScreen from './screens/DailyGameScreen'; // Günlük oyun ekranını ekleyin
import LetterCountScreen from './screens/LetterCountScreen';
import SettingScreen from './screens/SettingScreens';
import StatisticksScreen from './screens/StatisticksScreen';
import InfoScreen from './screens/InfoScreen';
import initializeDatabase from './src/initializeDatabase';  // Veritabanını başlatan işlevin yolu

const Stack = createStackNavigator();

function App() {
  useEffect(() => {
    // Veritabanını başlat
    initializeDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ANA SAYFA"
          component={HomeScreen}
          options={{ headerShown: false }} // Özel başlık metni
        />
        <Stack.Screen
          name="OYUN"
          component={GameScreen}
          options={{ headerShown: false }} // Özel başlık metni
        />
        <Stack.Screen
          name="GÜNLÜK OYUN"
          component={DailyGameScreen} // Günlük oyun ekranını tanımlayın
          options={{ headerShown: false }} // Özel başlık metni
        />
        <Stack.Screen
          name="HARF SAYISI"
          component={LetterCountScreen}
          options={{ headerShown: false }} // Özel başlık metni
        />
        <Stack.Screen
          name="SettingScreen"
          component={SettingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StatisticksScreen"
          component={StatisticksScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InfoScreen"
          component={InfoScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
