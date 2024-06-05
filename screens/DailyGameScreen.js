import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openDatabase } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext'; // Tema kullanımı için import

import Keyboard from '../constant/keyboard';
import { vibrate } from '../components/vibration';
import { onKeyPress } from '../components/onKeyPress';
import GuessRow from '../components/GuessRow';
import Timer from '../components/timer';
import { updateStats } from '../components/statistics'; // İstatistik fonksiyonunu içe aktarın

const db = openDatabase('wordle.db');

const DailyGameScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme(); // Tema kullanımı için ekleme
  const letterCount = 5;
  const [guesses, setGuesses] = useState(Array(6).fill('').map(() => Array(letterCount).fill('')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);
  const [correctWord, setCorrectWord] = useState('');
  const [letterStatuses, setLetterStatuses] = useState(Array(6).fill('').map(() => Array(letterCount).fill('')));
  const [isDailyMode, setIsDailyMode] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageColor, setMessageColor] = useState('green');
  const [usedLetters, setUsedLetters] = useState({});

  useEffect(() => {
    const initialize = async () => {
      if (isDailyMode) {
        await enableDailyMode();
      }
    };
    initialize();
  }, []);

  const getOrSetDailyWord = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const savedData = await AsyncStorage.getItem('dailyWord');
    if (savedData) {
      const { date, word } = JSON.parse(savedData);
      if (date === today) {
        console.log("Günlük Kelime: ", word);
        return word;
      }
    }

    let newWord = '';
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'select word from words where length = ? order by random() limit 1;',
          [5],
          (_, { rows }) => {
            if (rows.length > 0) {
              newWord = rows._array[0].word.toUpperCase();
              console.log("Yeni Günlük Kelime: ", newWord);
              AsyncStorage.setItem(
                'dailyWord',
                JSON.stringify({ date: today, word: newWord })
              );
              resolve(newWord);
            } else {
              reject('No words available.');
            }
          }
        );
      });
    });
  };

  const enableDailyMode = async () => {
    try {
      const dailyWord = await getOrSetDailyWord();
      const savedData = await AsyncStorage.getItem('dailyGameState');
      const today = new Date().toISOString().slice(0, 10);

      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.date === today) {
          setCorrectWord(dailyWord);
          setGuesses(parsedData.guesses ?? Array(6).fill('').map(() => Array(5).fill('')));
          setLetterStatuses(parsedData.letterStatuses ?? Array(6).fill('').map(() => Array(5).fill('')));
          setCurrentRow(parsedData.currentRow ?? 0);
          setCurrentColumn(parsedData.currentColumn ?? 0);
          setIsLocked(parsedData.isLocked ?? false);
          setShowMessage(parsedData.showMessage ?? false);
          setMessageText(parsedData.messageText ?? '');
          setMessageColor(parsedData.messageColor ?? 'green');
          setUsedLetters(parsedData.usedLetters ?? {});
          return;
        }
      }

      const initialGuesses = Array(6).fill('').map(() => Array(5).fill(''));
      const initialStatuses = Array(6).fill('').map(() => Array(5).fill(''));

      setCorrectWord(dailyWord);
      setGuesses(initialGuesses);
      setLetterStatuses(initialStatuses);
      setCurrentRow(0);
      setCurrentColumn(0);
      setIsLocked(false);
      setShowMessage(false);
      setMessageText('');
      setMessageColor('green');
      setUsedLetters({});

      await AsyncStorage.setItem('dailyGameState', JSON.stringify({
        date: today,
        guesses: initialGuesses,
        letterStatuses: initialStatuses,
        currentRow: 0,
        currentColumn: 0,
        isLocked: false,
        showMessage: false,
        messageText: '',
        messageColor: 'green',
        usedLetters: {},
      }));
    } catch (error) {
      console.error('Failed to enable daily mode:', error);
    }
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
              setIsLocked(true);
              setShowMessage(true);
              setMessageText('Kazandınız');
              setMessageColor('green');
              updateStats(true, currentRow); // İstatistik güncelleme
              saveGameState(true, 'Kazandınız', 'green', true);
            } else if (currentRow < 5) {
              setCurrentRow(currentRow + 1);
              setCurrentColumn(0);
              saveGameState(false, '', 'green', false);
            } else {
              setIsLocked(true);
              setShowMessage(true);
              setMessageText(`Doğru Kelime: ${correctWord}`);
              setMessageColor('red');
              updateStats(false, currentRow); // İstatistik güncelleme
              saveGameState(true, `Doğru Kelime: ${correctWord}`, 'red', true);
            }
          } else {
            vibrate();
          }
        },
        (_, error) => console.error('Failed to check guess:', error)
      );
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

  const onKeyPressHandler = (key) => {
    onKeyPress(key, currentColumn, setCurrentColumn, letterCount, guesses, setGuesses, currentRow, setCurrentRow, checkGuess, isLocked);
  };

  const saveGameState = async (isLocked, messageText, messageColor, showMessage) => {
    await AsyncStorage.setItem('dailyGameState', JSON.stringify({
      date: new Date().toISOString().slice(0, 10),
      guesses,
      letterStatuses,
      currentRow: isLocked ? currentRow : currentRow + 1,
      currentColumn: 0,
      isLocked,
      messageText,
      messageColor,
      showMessage,
      usedLetters,
    }));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('ANA SAYFA')}>
        <Ionicons name="home" size={24} color={theme.textColor} />
      </TouchableOpacity>
      <View style={styles.grid}>
        {guesses.map((guess, index) => (
          <GuessRow key={index} guess={guess} rowIndex={index} letterStatuses={letterStatuses} />
        ))}
      </View>
      {showMessage && (
        <View style={[styles.messageContainer, messageText === 'Kazandınız' ? styles.winMessageContainer : styles.correctWordContainer]}>
          <Text style={styles.messageText}>{messageText}</Text>
          <Timer isVisible={showMessage} />
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
  messageContainer: {
    position: 'absolute',
    bottom: '30%',
    left: '50%',
    transform: [{ translateX: -100 }],
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  winMessageContainer: {
    backgroundColor: 'green',
    left: '42%',
    bottom: '27%',
  },
  correctWordContainer: {
    backgroundColor: 'red',
    left: '42%',
    bottom: '27%',
  },
  messageText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default DailyGameScreen;
