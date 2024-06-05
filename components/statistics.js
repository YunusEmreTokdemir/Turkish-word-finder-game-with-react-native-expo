// components/statistics.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const updateStats = async (didWin, currentRow) => {
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
