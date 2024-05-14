import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color } from '../constant/color';

const HomeScreen = ({ navigation }) => {

  const handleSettingsPress = () => {
    navigation.navigate('SettingScreen'); // Ayarlar sayfasına yönlendirme
  };

  const handleStatisticksPress = () => {
    navigation.navigate('StatisticksScreen'); // İstatistikler sayfasına yönlendirme
  };

  const handleHowToPlayPress = () => {
    navigation.navigate('InfoScreen'); // Nasıl oynanır ekranına yönlendirme
  };

  const handleDailyGamePress = () => {
    navigation.navigate('GÜNLÜK OYUN'); // Günlük oyun ekranına yönlendirme
  };

  const handleUnlimitedGamePress = () => {
    navigation.navigate('OYUN'); // Sınırsız oyun ekranına yönlendirme
  };

  return (
      <View style={styles.container}>
        <Text style={styles.titlet}>KELİMETRE</Text>
        <Text style={styles.title}>MOD SEÇ</Text>
        <TouchableOpacity
          style={[styles.button]}
          onPress={handleUnlimitedGamePress}
        >
          <Text style={styles.buttonText}>SINIRSIZ MOD</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={handleDailyGamePress} // Günlük oyun ekranına yönlendirme
        >
          <Text style={styles.buttonText}>GÜNLÜK MOD</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress} // Ayarlar sayfasını açma işlevselliği
        >
          <Text>
            <Ionicons name="settings-outline" size={24} color="black" /> {/* Ayarlar simgesi */}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.StaticButton}
          onPress={handleStatisticksPress}
        >
          <Text>
            <Ionicons name="stats-chart-outline" size={24} color="black" /> 
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={handleHowToPlayPress}
        >
          <Text>
            <Ionicons name="information-circle-outline" size={24} color="black" />
          </Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#f0f0f0',
  },
  settingsButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 80 : 100,
    left: 20,
  },
  infoButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 80 : 100,
    right: 20,
  },
  StaticButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 80 : 100,
    left: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: color.primary500,
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
    minWidth: 250,
    alignItems: 'center',
  },
  buttonText: {
    color: color.primary200,
    fontSize: 18,
    fontWeight: 'bold',
  },
  titlet: {
    fontSize: 42,
    fontWeight: '900',
    marginTop: 40,
    marginBottom: 100,
    alignSelf: 'center',
    color: color.primary100,
    opacity: 0.4,
  },
});

export default HomeScreen;
