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
  const [letterStatuses, setLetterStatuses] = useState(Array(6).fill('').map(() => Array(letterCount).fill('')));
  const [isDailyMode, setIsDailyMode] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageColor, setMessageColor] = useState('green');

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
        const { date, guesses, letterStatuses, currentRow, currentColumn, isLocked, showMessage, messageText, messageColor } = JSON.parse(savedData);
        if (date === today) {
          setCorrectWord(dailyWord);
          setGuesses(guesses ?? Array(6).fill('').map(() => Array(5).fill('')));
          setLetterStatuses(letterStatuses ?? Array(6).fill('').map(() => Array(5).fill('')));
          setCurrentRow(currentRow ?? 0);
          setCurrentColumn(currentColumn ?? 0);
          setIsLocked(isLocked ?? false);
          setShowMessage(showMessage ?? false);
          setMessageText(messageText ?? '');
          setMessageColor(messageColor ?? 'green');
          return;
        }
      } catch (error) {
        console.error('Failed to parse saved data:', error);
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
    }));
  };

  const updateStats = async (didWin) => {
    const stats = await AsyncStorage.getItem('gameStats');
    let gameStats = stats ? JSON.parse(stats) : {
      gamesPlayed: 0,
      wins: 0,
      winPercentage: 0,
      bestAttempt: 0,
      currentStreak: 0,
      maxStreak: 0,
      attemptDistribution: [0, 0, 0, 0, 0, 0],
    };

    gameStats.gamesPlayed += 1;
    if (didWin) {
      gameStats.wins += 1;
      gameStats.currentStreak += 1;
      if (gameStats.currentStreak > gameStats.maxStreak) {
        gameStats.maxStreak = gameStats.currentStreak;
      }
      if (gameStats.bestAttempt === 0 || currentRow + 1 < gameStats.bestAttempt) {
        gameStats.bestAttempt = currentRow + 1;
      }
      gameStats.attemptDistribution[currentRow] += 1;
    } else {
      gameStats.currentStreak = 0;
    }
    gameStats.winPercentage = Math.round((gameStats.wins / gameStats.gamesPlayed) * 100);

    await AsyncStorage.setItem('gameStats', JSON.stringify(gameStats));
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
              setShowMessage(true);
              setMessageText('Kazandınız');
              setMessageColor('green');
              updateStats(true);
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
              updateStats(false);
              saveGameState(true, `Doğru Kelime: ${correctWord}`, 'red', true);
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

  const onKeyPress = (key) => {
    if (isLocked) {
      return;
    }

    if (key === '✓') {
      if (currentColumn === letterCount) {
        checkGuess();
      } else {
        Vibration.vibrate();
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
      showMessage
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
          case 'grey':
            boxColor = '#E0E0E0';
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
      {showMessage && (
        <View style={[styles.messageContainer, messageText === 'Kazandınız' ? styles.winMessageContainer : styles.correctWordContainer]}>
          <Text style={styles.messageText}>{messageText}</Text>
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
  messageContainer: {
    position: 'absolute',
    bottom: '30%',
    left: '56%',
    transform: [{ translateX: -100 }],
    padding: 10,
    borderRadius: 10,
  },
  winMessageContainer: {
    backgroundColor: 'green',
    position: 'absolute',
    bottom: '30%',
    left: '65%',
    transform: [{ translateX: -100 }],
    padding: 10,
    borderRadius: 10,
  },
  correctWordContainer: {
    backgroundColor: 'red',
  },
  messageText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default DailyGameScreen;
