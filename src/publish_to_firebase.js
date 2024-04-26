const admin = require('firebase-admin');
const serviceAccount = require('./wordle-bd10b-firebase-adminsdk-bi09d-e30ff0af1f.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wordle-bd10b.firebaseio.com" // Dikkat: databaseURL kısmını düzelttim.
  });
  
  const db = admin.firestore();
  console.log('Firebase Admin and Firestore have been initialized.');
  
  const fs = require('fs');
  
  fs.readFile('./wordle_kelime_listesi.json', 'utf8', (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      return;
    }
  
    const jsonData = JSON.parse(data);
    let totalWords = 0;
    let wordsProcessed = 0;
  
    Object.keys(jsonData).filter(lengthKey => lengthKey !== '7_harfli').forEach(lengthKey => {
      const words = jsonData[lengthKey];
      totalWords += words.length;
      const collectionRef = db.collection('words').doc(lengthKey).collection('items');
  
      words.forEach((word, index) => {
        collectionRef.doc(word).set({name: word})
          .then(() => {
            wordsProcessed++;
            console.log(`Document ${wordsProcessed}/${totalWords} written for ${word} in ${lengthKey}`);
            if (wordsProcessed === totalWords) {
              console.log('All documents have been successfully written.');
            }
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      });
    });
  });