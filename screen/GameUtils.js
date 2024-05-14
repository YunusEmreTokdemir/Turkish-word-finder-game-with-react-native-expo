export const initializeDatabase = async (db) => {
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
  
  export const checkLetters = (userGuess, correctWord, letterCount) => {
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
  
    return statusArray;
  };
  