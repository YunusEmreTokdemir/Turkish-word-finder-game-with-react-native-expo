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
              // Veritabanı boşsa, verileri aktar
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

export default initializeDatabase;