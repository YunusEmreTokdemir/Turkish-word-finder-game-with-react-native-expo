import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openDatabase } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Keyboard from '../constant/keyboard';

const db = openDatabase('wordle.db');

const DailyGameScreen = () => {
  const navigation = useNavigation();
  const letterCount = 5;
  const [guesses, setGuesses] = useState(Array(6).fill('').map(() => Array(letterCount).fill('')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);
  const [correctWord, setCorrectWord] = useState('');
  const [letterStatuses, setLetterStatuses] = useState(Array(6).fill('').map(() => Array(letterCount).fill('grey')));
  const [isDailyMode, setIsDailyMode] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [showWinningMessage, setShowWinningMessage] = useState(false);

  useEffect(() => {
    initializeDatabase().then(() => {
      if (isDailyMode) {
        enableDailyMode();
      }
    });
  }, []);

  const initializeDatabase = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'create table if not exists words (id integer primary key not null, length integer, word text);',
          [],
          () => resolve(),
          (_, error) => {
            console.log('Error initializing database: ' + error.message);
            reject();
          }
        );
      });
    });
  };

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
    const dailyWord = await getOrSetDailyWord();
    const savedData = await AsyncStorage.getItem('dailyGameState');
    const today = new Date().toISOString().slice(0, 10);

    if (savedData) {
      try {
        const { date, guesses, letterStatuses, currentRow, currentColumn, isLocked } = JSON.parse(savedData);
        if (date === today) {
          setCorrectWord(dailyWord);
          setGuesses(guesses ?? Array(6).fill('').map(() => Array(5).fill('')));
          setLetterStatuses(letterStatuses ?? Array(6).fill('').map(() => Array(5).fill('grey')));
          setCurrentRow(currentRow ?? 0);
          setCurrentColumn(currentColumn ?? 0);
          setIsLocked(isLocked ?? false);
          return;
        }
      } catch (error) {
        console.error('Failed to parse saved data:', error);
      }
    }

    const initialGuesses = Array(6).fill('').map(() => Array(5).fill(''));
    const initialStatuses = Array(6).fill('').map(() => Array(5).fill('grey'));

    setCorrectWord(dailyWord);
    setGuesses(initialGuesses);
    setLetterStatuses(initialStatuses);
    setCurrentRow(0);
    setCurrentColumn(0);
    setIsLocked(false);

    await AsyncStorage.setItem('dailyGameState', JSON.stringify({
      date: today,
      guesses: initialGuesses,
      letterStatuses: initialStatuses,
      currentRow: 0,
      currentColumn: 0,
      isLocked: false
    }));
  };

  const checkGuess = () => {
    const userGuess = guesses[currentRow].join('').toUpperCase();
    db.transaction(tx => {
      tx.executeSql(
        'select * from words where length = ? and word = ?;',
        [letterCount, userGuess],
        (_, { rows }) => {
          if (rows.length > 0) {
            checkLetters(userGuess);
            if (userGuess === correctWord) {
              setIsLocked(true);
              setShowWinningMessage(true);
              saveGameState(true);
              setTimeout(() => {
                setShowWinningMessage(false);
              }, 3000);
            } else if (currentRow < 5) {
              setCurrentRow(currentRow + 1);
              setCurrentColumn(0);
              saveGameState(false);
            } else {
              setIsLocked(true);
              saveGameState(true);
            }
          } else {
            Vibration.vibrate();
          }
        },
        (_, error) => console.error('Failed to check guess:', error)
      );
    });
  };

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

  const onKeyPress = (key) => {
    if (isLocked) {
      return;
    }

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

  const saveGameState = async (isLocked) => {
    await AsyncStorage.setItem('dailyGameState', JSON.stringify({
      date: new Date().toISOString().slice(0, 10),
      guesses,
      letterStatuses,
      currentRow: isLocked ? currentRow : currentRow + 1,
      currentColumn: 0,
      isLocked
    }));
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('ANA SAYFA')}>
        <Ionicons name="home" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.grid}>
        {guesses.map((guess, index) => (
          <GuessRow key={index} guess={guess} rowIndex={index} />
        ))}
      </View>
      {showWinningMessage && (
        <View style={styles.winningMessageContainer}>
          <Text style={styles.winningMessage}>Kazandınız!</Text>
        </View>
      )}
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
  homeButton: {
    position: 'absolute',
    top: 80,
    left: 25,
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
  winningMessageContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
  },
  winningMessage: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DailyGameScreen;
