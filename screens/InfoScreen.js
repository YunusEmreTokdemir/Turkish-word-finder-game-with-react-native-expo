import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InfoScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Geri butonu */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Ionicons name="close" size={30} color="black" />
      </TouchableOpacity>
      
      {/* Başlık */}
      <Text style={styles.headerText}>Nasıl Oynanır</Text>

      {/* Açıklamalar */}
      <Text style={styles.description}>
        6 denemede gizli kelimeyi tahmin etmeniz gerekiyor ve ne kadar yakın olduğunuzu göstermek için harflerin rengi değişiyor.
      </Text>
      <Text style={styles.description}>
        Oyuna başlamak için herhangi bir kelime girin, örneğin:
      </Text>
      
      <View style={styles.wordContainer}>
        {['N', 'E', 'H', 'İ', 'R'].map((letter, index) => (
          <View key={index} style={[
            styles.letterBox,
            (letter === 'N' || letter === 'M' || letter === 'İ') ? styles.wrong : {}, 
            (letter === 'R') ? styles.correct : {},
            (letter === 'H' || letter === 'E') ? styles.wrongt : {}, 
          ]}>
            <Text style={styles.letter}>{letter}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.instruction}>N ve İ harfleri hedef kelimede yok.</Text>
      <Text style={styles.instruction}>E ve H harfi hedef kelimenin içinde ama yanlış yerde.</Text>
      <Text style={styles.instruction}>R harfi hedef kelimenin içinde ve doğru yerde.</Text>
            
      <View style={styles.wordContainer}>
        {['H', 'A', 'B', 'E', 'R'].map((letter, index) => (
          <View key={index} style={[
            styles.letterBox,
            (letter === 'H' || letter === 'A' || letter ==='B' || letter === 'E' || letter === 'R') ? styles.correct : {}, 
          ]}>
            <Text style={styles.letter}>{letter}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.finalNote}>Kelimeyi buldunuz! 🏆</Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    marginTop: Platform.OS === 'android' ? 60 : 60, // Duruma göre statusBar yüksekliğini dikkate alın
    alignSelf: 'flex-end',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    marginBottom: 15,
  },
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  letterBox: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    margin: 4,
  },
  wrong: {
    backgroundColor: '#C0C0C0', // Gri renk
  },
  wrongt: {
    backgroundColor: '#FF9933', // Kırmızı renk
  },
  correct: {
    backgroundColor: '#00CC00', // Yeşil renk
  },
  letter: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  instruction: {
    fontSize: 16,
    marginBottom: 10,
  },
  finalNote: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'green', // Yeşil renk
  },
  // Diğer stil tanımlamalarınız burada yer alabilir
});

export default InfoScreen;
