import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openDatabase } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Keyboard from '../constant/keyboard';

const db = openDatabase('wordle.db');

const GameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const letterCount = route.params?.letterCount || 5;
  const [guesses, setGuesses] = useState(Array(6).fill('').map(() => Array(letterCount).fill('')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);
  const [correctWord, setCorrectWord] = useState('');
  const [letterStatuses, setLetterStatuses] = useState(Array(6).fill('').map(() => Array(letterCount).fill('')));
  const [kazandiniz, setKazandiniz] = useState(false);
  const [showCorrectWord, setShowCorrectWord] = useState(false);
  const [correctWordColor, setCorrectWordColor] = useState('green');

  useEffect(() => {
    initializeDatabase().then(() => {
      rastgeleKelimeSec(letterCount);
    });
  }, [letterCount]);

  const initializeDatabase = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'create table if not exists words (id integer primary key not null, length integer, word text);',
          [],
          () => {
            tx.executeSql('select count(id) as cnt from words;', [], (_, { rows }) => {
              if (rows._array[0].cnt === 0) {
                console.log('Database is empty, inserting data...');
                // Kelimeleri ekleyin
                Object.keys(kelimelistesi).forEach(key => {
                  const length = parseInt(key.split('_')[0]);
                  kelimelistesi[key].forEach(word => {
                    tx.executeSql('insert into words (length, word) values (?, ?);', [length, word]);
                  });
                });
              } else {
                console.log('Database already initialized.');
              }
              resolve();
            });
          },
          (_, error) => {
            console.log('Error initializing database: ' + error.message);
            reject();
          }
        );
      });
    });
  };

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
            console.log(`Seçilen kelime: ${word}`); // Seçilen kelimeyi konsola basın
          }
        },
        (_, error) => console.error('Failed to fetch word from database:', error)
      );
    });
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

  const onKeyPress = (key) => {
    if (key === '✓') {
      if (currentColumn === letterCount) {
        checkGuess();
      } else {
        console.log('Henüz tamamlanmadı!');
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
              setKazandiniz(true); // Kazandınız mesajını göster
              updateStats(true);
              setTimeout(() => {
                setKazandiniz(false); // Kazandınız mesajını kapat
                restartGame(); // Yeni oyunu başlat
              }, 2000);
            } else if (currentRow < 5) {
              setCurrentRow(currentRow + 1);
              setCurrentColumn(0);
            } else {
              console.log("Oyun Bitti");
              updateStats(false);
              setShowCorrectWord(true);
              setCorrectWordColor('red');
              setTimeout(() => {
                setShowCorrectWord(false);
                restartGame();
              }, 3000);
            }
          } else {
            Vibration.vibrate(500); // 500 milisaniye titreşim
            console.log('Kelime havuzunda bu kelime yok!');
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
      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('SettingScreen')}>
        <Ionicons name="settings-outline" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.grid}>
        {guesses.map((guess, index) => (
          <GuessRow key={index} guess={guess} rowIndex={index} />
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
    bottom: '30%', // Ekranın altında görünmesi için ayarlayabilirsiniz.
    left: '43%',
    transform: [{ translateX: -50 }],
    padding: 10,
    borderRadius: 10,
  },
  correctWordText: {
    fontSize: 18,
    color: 'white', // Yazının rengi.
    textAlign: 'center',
    fontWeight: 'bold', // Yazının kalınlığı.
  },
});

export default GameScreen;
