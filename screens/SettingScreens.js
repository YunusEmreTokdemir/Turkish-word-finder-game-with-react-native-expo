import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, Switch } from 'react-native';
import { Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { enableVibration, disableVibration, isVibrationEnabled } from '../components/vibration';
import { useTheme, darkTheme, lightTheme } from '../theme/ThemeContext';

const SettingScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const [letterCount, setLetterCount] = React.useState(5);
  const [isVibrationOn, setIsVibrationOn] = React.useState(false);

  React.useEffect(() => {
    const loadVibrationSetting = async () => {
      const enabled = await isVibrationEnabled();
      setIsVibrationOn(enabled);
    };
    loadVibrationSetting();
  }, []);

  const toggleVibration = async (value) => {
    setIsVibrationOn(value);
    if (value) {
      await enableVibration();
    } else {
      await disableVibration();
    }
  };

  const selectLetterCountAndNavigate = (count) => {
    setLetterCount(count);
    navigation.navigate('OYUN', { letterCount: count });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('ANA SAYFA')}
      >
        <Text>
          <Ionicons name="home" size={24} color={theme.textColor} />
        </Text>
      </TouchableOpacity>
      <Icon
        name="close"
        type="antdesign"
        size={24}
        containerStyle={styles.closeIcon}
        onPress={() => navigation.goBack()}
        color={theme.textColor}
      />
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: theme.textColor }]}>Ayarlar</Text>
      </View>
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: theme.textColor }]}>Harf Sayısı</Text>
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
        <Text style={[styles.settingText, { color: theme.textColor }]}>Karanlık Mod</Text>
        <Switch
          value={theme === darkTheme}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: "#007bff" }}
          thumbColor={theme === darkTheme ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
        />
      </View>
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: theme.textColor }]}>Titreşim</Text>
        <Switch
          value={isVibrationOn}
          onValueChange={toggleVibration}
          trackColor={{ false: "#767577", true: "#007bff" }}
          thumbColor={isVibrationOn ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  closeIcon: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 80,
    right: 15,
    zIndex: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 80,
    left: 15,
    zIndex: 10,
  },
  headerContainer: {
    marginTop: Platform.OS === 'android' ? 60 : 80,
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
