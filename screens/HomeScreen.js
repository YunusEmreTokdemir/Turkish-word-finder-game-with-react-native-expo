import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext'; // Doğru import
import { color } from '../constant/color'; // Renk sabitlerini import et

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();

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
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.titlet, { color: theme.textColor }]}>KELİMETRE</Text>
      <Text style={[styles.title, { color: theme.textColor }]}>MOD SEÇ</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: color.primary500 }]} 
        onPress={handleUnlimitedGamePress}
      >
        <Text style={[styles.buttonText, { color: color.primary200 }]}>SINIRSIZ MOD</Text> 
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: color.primary500 }]} 
        onPress={handleDailyGamePress} 
      >
        <Text style={[styles.buttonText, { color: color.primary200 }]}>GÜNLÜK MOD</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={handleSettingsPress} 
      >
        <Text>
          <Ionicons name="settings-outline" size={24} color={theme.textColor} />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.StaticButton}
        onPress={handleStatisticksPress}
      >
        <Text>
          <Ionicons name="stats-chart-outline" size={24} color={theme.textColor} />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.infoButton}
        onPress={handleHowToPlayPress}
      >
        <Text>
          <Ionicons name="information-circle-outline" size={24} color={theme.textColor} />
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
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
    minWidth: 250,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  titlet: {
    fontSize: 48, // Daha baskın olması için font boyutu artırıldı
    fontWeight: '900',
    marginTop: 40,
    marginBottom: 100,
    alignSelf: 'center',
    color: color.primary100,
    opacity: 0.4,
  },
});

export default HomeScreen;
