import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Icon, Switch } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';


const SettingScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [letterCount, setLetterCount] = React.useState(5); 

  const selectLetterCountAndNavigate = (count) => {
    setLetterCount(count);
    navigation.navigate('OYUN', { letterCount: count });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('ANA SAYFA')}
      >
        <Text>
          <Ionicons name="home" size={24} color="black" />
        </Text>
      </TouchableOpacity>
      <Icon
        name="close"
        type="antdesign"
        size={24}
        containerStyle={styles.closeIcon}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Ayarlar</Text>
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Harf Sayısı</Text>
        <View style={styles.letterCountContainer}>
          {[4, 5, 6, 7].map((count) => (
            <TouchableOpacity
              key={count}
              style={letterCount === count ? styles.selectedLetterButton : styles.letterButton}
              onPress={() => selectLetterCountAndNavigate(count)}
            >
              <Text style={styles.buttonText}>{count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Karanlık Mod</Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Android için StatusBar yüksekliği, iOS için gerekli değil
    marginHorizontal: 5,
  },
  closeIcon: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 80, // Android için StatusBar yüksekliği, iOS için daha yüksek bir değer
    right: 15, // Sağ taraftan boşluk
    zIndex: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 80, // Aynı şekilde closeIcon ile aynı yükseklikte olmalı
    left: 15, // Soldan boşluk
    zIndex: 10,
  },
  headerContainer: {
    marginTop: Platform.OS === 'android' ? 60 : 80, // closeIcon ve backButton'dan yeterli boşluk
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  settingItem: {
    alignItems: 'center',
    padding: 10,
  },
  settingText: {
    fontSize: 18,
    marginBottom: 10,
  },
  letterCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  letterButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    margin: 5,
    borderRadius: 20,
  },
  selectedLetterButton: {
    backgroundColor: '#007bff',
    padding: 10,
    margin: 5,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  
});

export default SettingScreen;