import { vibrate } from './vibration';

export const onKeyPress = (key, currentColumn, setCurrentColumn, letterCount, guesses, setGuesses, currentRow, setCurrentRow, checkGuess, isLocked) => {
  if (isLocked) {
    return;
  }

  if (key === '✓') {
    if (currentColumn === letterCount) {
      checkGuess();
    } else {
      vibrate();
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
