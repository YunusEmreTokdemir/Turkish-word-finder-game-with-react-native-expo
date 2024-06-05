import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openDatabase } from 'expo-sqlite';
import { useTheme } from '../theme/ThemeContext'; // Tema kullanımı için import

import Keyboard from '../constant/keyboard';
import { vibrate } from '../components/vibration';
import { onKeyPress } from '../components/onKeyPress';
import GuessRow from '../components/GuessRow';
import { updateStats } from '../components/statistics'; // İstatistik fonksiyonunu içe aktarın

const db = openDatabase('wordle.db');

const GameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme(); // Tema kullanımı için ekleme
  const letterCount = route.params?.letterCount || 5;
  const [guesses, setGuesses] = useState(Array(6).fill('').map(() => Array(letterCount).fill('')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);
  const [correctWord, setCorrectWord] = useState('');
  const [letterStatuses, setLetterStatuses] = useState(Array(6).fill('').map(() => Array(letterCount).fill('')));
  const [kazandiniz, setKazandiniz] = useState(false);
  const [showCorrectWord, setShowCorrectWord] = useState(false);
  const [correctWordColor, setCorrectWordColor] = useState('green');
  const [usedLetters, setUsedLetters] = useState({});

  useEffect(() => {
    rastgeleKelimeSec(letterCount);
  }, [letterCount]);

  const rastgeleKelimeSec = (harfSayisi) => {
    db.transaction(tx => {
      tx.executeSql(
        'select word from words where length = ? order by random() limit 1;',
        [harfSayisi],
        (_, { rows }) => {
          if (rows.length > 0) {
            const word = rows._array[0].word.toUpperCase();
            setCorrectWord(word);
            setGuesses(Array(6).fill('').map(() => Array(harfSayisi).fill('')));
            setLetterStatuses(Array(6).fill('').map(() => Array(harfSayisi).fill('')));
            setCurrentRow(0);
            setCurrentColumn(0);
            setShowCorrectWord(false);
            setUsedLetters({});
            console.log(`Seçilen kelime: ${word}`); // Seçilen kelimeyi konsola basın
          }
        },
        (_, error) => console.error('Failed to fetch word from database:', error)
      );
    });
  };

  const checkGuess = async () => {
    const userGuess = guesses[currentRow].join('').toUpperCase();
    db.transaction(tx => {
      tx.executeSql(
        'select * from words where length = ? and word = ?;',
        [letterCount, userGuess],
        (_, { rows }) => {
          if (rows.length > 0) {
            checkLetters(userGuess);
            updateUsedLetters(userGuess);
            if (userGuess === correctWord) {
              setKazandiniz(true);
              updateStats(true, currentRow); // İstatistik güncelleme
              setTimeout(() => {
                setKazandiniz(false);
                restartGame();
              }, 3000); // Süreyi 2800 milisaniye olarak değiştirin
            } else if (currentRow < 5) {
              setCurrentRow(currentRow + 1);
              setCurrentColumn(0);
            } else {
              console.log("Oyun Bitti");
              updateStats(false, currentRow); // İstatistik güncelleme
              setShowCorrectWord(true);
              setCorrectWordColor('red');
              setTimeout(() => {
                setShowCorrectWord(false);
                restartGame();
              }, 3000);
            }
          } else {
            vibrate();
          }
        },
        (_, error) => console.error('Failed to check guess:', error)
      );
    });
  };

  const restartGame = () => {
    rastgeleKelimeSec(letterCount);
  };

  const checkLetters = (userGuess) => {
    let statusArray = Array(letterCount).fill('grey');
    let tempCorrectWord = correctWord.split('');

    for (let i = 0; i < letterCount; i++) {
      if (userGuess[i] === correctWord[i]) {
        statusArray[i] = 'green';
        tempCorrectWord[i] = null;
      }
    }

    for (let i = 0; i < letterCount; i++) {
      if (tempCorrectWord.includes(userGuess[i]) && statusArray[i] !== 'green') {
        statusArray[i] = 'yellow';
        tempCorrectWord[tempCorrectWord.indexOf(userGuess[i])] = null;
      }
    }

    setLetterStatuses(statuses => {
      statuses[currentRow] = statusArray;
      return [...statuses];
    });
  };

  const updateUsedLetters = (userGuess) => {
    const newUsedLetters = { ...usedLetters };
    userGuess.split('').forEach((letter) => {
      if (!correctWord.includes(letter)) {
        newUsedLetters[letter] = true;
      }
    });
    setUsedLetters(newUsedLetters);
  };

  const onKeyPressHandler = (key) => {
    onKeyPress(key, currentColumn, setCurrentColumn, letterCount, guesses, setGuesses, currentRow, setCurrentRow, checkGuess, false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('ANA SAYFA')}>
        <Ionicons name="home" size={24} color={theme.textColor} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('SettingScreen')}>
        <Ionicons name="settings-outline" size={24} color={theme.textColor} />
      </TouchableOpacity>
      <View style={styles.grid}>
        {guesses.map((guess, index) => (
          <GuessRow key={index} guess={guess} rowIndex={index} letterStatuses={letterStatuses} />
        ))}
      </View>
      {kazandiniz && (
        <View style={styles.kazandinizContainer}>
          <Text style={styles.kazandinizText}>Kazandınız!</Text>
        </View>
      )}
      {showCorrectWord && (
        <View style={[styles.correctWordContainer, { backgroundColor: correctWordColor }]}>
          <Text style={styles.correctWordText}>Doğru Kelime: {correctWord}</Text>
        </View>
      )}
      <Keyboard onKeyPress={onKeyPressHandler} usedLetters={usedLetters} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  kazandinizContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(0, 128, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
  },
  kazandinizText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  correctWordContainer: {
    position: 'absolute',
    bottom: '30%',
    left: '43%',
    transform: [{ translateX: -50 }],
    padding: 10,
    borderRadius: 10,
  },
  correctWordText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default GameScreen;
