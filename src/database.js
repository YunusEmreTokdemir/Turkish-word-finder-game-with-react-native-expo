// src/database.js
import { openDatabase } from 'expo-sqlite';
import kelimelistesi from './wordle_kelime_listesi.json';  // JSON dosyası yolu

const db = openDatabase('wordle.db');

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

const fetchRandomWord = (length) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'select word from words where length = ? order by random() limit 1;',
        [length],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows._array[0].word.toUpperCase());
          } else {
            reject('No words available.');
          }
        },
        (_, error) => {
          console.error('Failed to fetch word from database:', error);
          reject(error);
        }
      );
    });
  });
};

const checkWordExists = (length, word) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'select * from words where length = ? and word = ?;',
        [length, word],
        (_, { rows }) => {
          resolve(rows.length > 0);
        },
        (_, error) => {
          console.error('Failed to check word in database:', error);
          reject(error);
        }
      );
    });
  });
};

export { initializeDatabase, fetchRandomWord, checkWordExists };
