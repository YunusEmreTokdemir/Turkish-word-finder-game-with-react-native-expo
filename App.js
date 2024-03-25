import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import LetterCountScreen from './screens/LetterCountScreen';
import SettingScreen from './screens/SettingScreens';
import StatisticksScreen from './screens/StatisticksScreen';
import InfoScreen from './screens/InfoScreen';


const Stack = createStackNavigator();

function App() {
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
