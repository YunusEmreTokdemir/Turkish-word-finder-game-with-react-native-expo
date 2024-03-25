import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import Keyboard from '../constant/keyboard';
import kelimelistesi from '../src/wordle_kelime_listesi.json';

const GameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const letterCount = route.params?.letterCount || 5;
  const [guesses, setGuesses] = useState(Array(6).fill('').map(() => Array(letterCount).fill('')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);
  const [correctWord, setCorrectWord] = useState('');
  const [letterStatuses, setLetterStatuses] = useState(Array(6).fill('').map(() => Array(letterCount).fill('grey')));

  useEffect(() => {
    const yeniKelime = rastgeleKelimeSec(letterCount);
    setCorrectWord(yeniKelime.toUpperCase());
    setGuesses(Array(6).fill('').map(() => Array(letterCount).fill('')));
    setLetterStatuses(Array(6).fill('').map(() => Array(letterCount).fill('grey')));
    setCurrentRow(0);
    setCurrentColumn(0);
  }, [letterCount]);

  const rastgeleKelimeSec = (harfSayisi) => {
    const kelimeler = kelimelistesi[`${harfSayisi}_harfli`];
    const rastgeleIndex = Math.floor(Math.random() * kelimeler.length);
    console.log(kelimeler[rastgeleIndex]);
    return kelimeler[rastgeleIndex];
  };

  // Harf tuşlarına basıldığında çalışacak fonksiyon
  const onKeyPress = (key) => {
    if (key === '✓') {
      if (currentColumn === letterCount) {
        checkGuess();
      } else {
        Alert.alert('Uyarı', 'Henüz tamamlanmadı!');
      }
    } else if (key === '⌫') {
      if (currentColumn > 0) {
        const newGuesses = [...guesses];
        newGuesses[currentRow][currentColumn - 1] = '';
        setGuesses(newGuesses);
        setCurrentColumn(currentColumn - 1);
      }
    } else if (currentColumn < letterCount) {
      const newGuesses = [...guesses];
      newGuesses[currentRow][currentColumn] = key;
      setGuesses(newGuesses);
      setCurrentColumn(currentColumn + 1);
    }
  };

  // Kullanıcının tahminini kontrol etme
  // Kullanıcının tahminini kontrol etme ve oyunu sonlandırma
const checkGuess = () => {
  const userGuess = guesses[currentRow].join('').toUpperCase();
  if (kelimelistesi[`${letterCount}_harfli`].map(kelime => kelime.toUpperCase()).includes(userGuess)) {
    checkLetters(userGuess);
    if (userGuess === correctWord) {
      // Doğru kelimeyi tahmin etti, oyunu sonlandır ve tebrikler mesajı göster
      Alert.alert("Tebrikler", `Doğru kelimeyi buldunuz: ${correctWord}`, [
        { text: "Yeniden Oyna", onPress: () => restartGame() }
      ]);
    } else if (currentRow < 5) {
      setCurrentRow(currentRow + 1);
      setCurrentColumn(0);
    } else {
      // Maksimum tahmin sayısına ulaşıldı, oyunu sonlandır
      Alert.alert("Oyun Bitti", `Doğru kelime: ${correctWord}`, [
        { text: "Yeniden Oyna", onPress: () => restartGame() }
      ]);
    }
  } else {
    Alert.alert('Hata', 'Kelime havuzunda bu kelime yok!');
  }
};

// Oyunu yeniden başlat
const restartGame = () => {
  // Yeni harf sayısına göre doğru kelimeyi seç
  const yeniKelime = rastgeleKelimeSec(letterCount);
  setCorrectWord(yeniKelime.toUpperCase());
  setGuesses(Array(6).fill('').map(() => Array(letterCount).fill('')));
  setLetterStatuses(Array(6).fill('').map(() => Array(letterCount).fill('grey')));
  setCurrentRow(0);
  setCurrentColumn(0);
};


  // Harflerin yerini kontrol etme ve renklendirme
  const checkLetters = (userGuess) => {
    let statusArray = Array(letterCount).fill('grey');
    let tempCorrectWord = correctWord.split('');

    for (let i = 0; i < letterCount; i++) {
      if (userGuess[i] === correctWord[i]) {
        statusArray[i] = 'green';
        tempCorrectWord[i] = ' ';
      }
    }

    for (let i = 0; i < letterCount; i++) {
      if (tempCorrectWord.includes(userGuess[i]) && statusArray[i] !== 'green') {
        statusArray[i] = 'yellow';
        tempCorrectWord[tempCorrectWord.indexOf(userGuess[i])] = ' ';
      }
    }

    setLetterStatuses(statuses => {
      statuses[currentRow] = statusArray;
      return [...statuses];
    });
  };

  const GuessRow = ({ guess, rowIndex }) => (
    <View style={styles.guessRow}>
      {guess.map((letter, index) => {
        let boxColor;
        switch (letterStatuses[rowIndex][index]) {
          case 'green':
            boxColor = '#4CAF50';
            break;
          case 'yellow':
            boxColor = '#FFEB3B';
            break;
          default:
            boxColor = '#FFFFFF';
        }

        return (
          <View key={index} style={[styles.guessBox, { backgroundColor: boxColor }]}>
            <Text style={styles.guessText}>{letter.toUpperCase()}</Text>
          </View>
        );
      })}
    </View>
  );

  

  // Kullanıcı arayüzü ve stil tanımlamaları burada yer alacak

  return (
    <SafeAreaView style={styles.safeArea}>
  <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('ANA SAYFA')}>
    <Ionicons name="home" size={24} color="black" />
  </TouchableOpacity>
  <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('SettingScreen')}>
    <Ionicons name="settings-outline" size={24} color="black" />
  </TouchableOpacity>
  <View style={styles.grid}>
    {guesses.map((guess, index) => (
      <GuessRow key={index} guess={guess} rowIndex={index} />
    ))}
  </View>
  <Keyboard onKeyPress={onKeyPress} />
</SafeAreaView>

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    position: 'absolute',
    top: 80,
    left: 25,
    zIndex: 10,
  },
  settingsButton: {
    position: 'absolute',
    top: 80,
    right: 25,
    zIndex: 10,
  },
  guessRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  guessBox: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    margin: 2,
  },
  guessText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#333333',
  },
});


export default GameScreen;