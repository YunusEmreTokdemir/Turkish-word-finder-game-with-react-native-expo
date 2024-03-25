import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Expo kullanıyorsanız

const HomeScreen = ({ navigation }) => {

  const handleSettingsPress = () => {
    navigation.navigate('SettingScreen'); // Ayarlar sayfasına yönlendirme
  };

  const handleStatisticksPress = () => {
    navigation.navigate('StatisticksScreen'); // İstatistikler sayfasına yönlendirme
  };
  const handleHowToPlayPress = () => {
    navigation.navigate('InfoScreen'); // Navigate to the How to Play screen
  };
  return (
      <View style={styles.container}>
        <Text style={styles.titlet}>KELİMETRE</Text>
        <Text style={styles.title}>MOD SEÇ</Text>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => navigation.navigate('OYUN')}
        >
          <Text style={styles.buttonText}>SINIRSIZ MOD</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => navigation.navigate('OYUN')}
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
    paddingTop: Platform.OS === 'android' ? 25 : 0, // StatusBar yüksekliğini telafi etmek için
    backgroundColor: '#f0f0f0', // Arka planı hafif bir gri ton yaparak daha yumuşak bir görünüm verir
  },
  settingsButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 80 : 100, // Adjust the top value according to your status bar height
    left: 20,
  },
  infoButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 80 : 100, // Değerleri aşağıya indir
    right: 20
  },
  StaticButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 80 : 1000, // Same as settingsButton
    left: 60, 
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#32cd32',
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
    minWidth: 250, // Butonların minimum genişliği
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titlet: {
    fontSize: 42,
    fontWeight: '900',
    marginTop: 40,
    marginBottom: 100,
    alignSelf: 'center',
    color: '#808080', // Açık gri renk, soluk görünüm için
    opacity: 0.4, // Opaklık
  },
});

export default HomeScreen;
