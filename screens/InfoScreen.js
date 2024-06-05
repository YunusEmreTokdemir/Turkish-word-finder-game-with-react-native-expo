import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext'; // Doğru import

import { colorstoEmoji } from '../constant/color'; // Renk sabitlerini import et

const InfoScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Geri butonu */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Ionicons name="close" size={30} color={theme.textColor} />
      </TouchableOpacity>
      
      {/* Başlık */}
      <Text style={[styles.headerText, { color: theme.textColor }]}>Nasıl Oynanır</Text>

      {/* Açıklamalar */}
      <Text style={[styles.description, { color: theme.textColor }]}>
        6 denemede gizli kelimeyi tahmin etmeniz gerekiyor ve ne kadar yakın olduğunuzu göstermek için harflerin rengi değişiyor.
      </Text>
      <Text style={[styles.description, { color: theme.textColor }]}>
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

      <Text style={[styles.instruction, { color: theme.textColor }]}>N ve İ harfleri hedef kelimede yok.</Text>
      <Text style={[styles.instruction, { color: theme.textColor }]}>E ve H harfi hedef kelimenin içinde ama yanlış yerde.</Text>
      <Text style={[styles.instruction, { color: theme.textColor }]}>R harfi hedef kelimenin içinde ve doğru yerde.</Text>
            
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
      <Text style={[styles.finalNote, { color: theme.correct }]}>Kelimeyi buldunuz! 🏆</Text>
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
    backgroundColor: colorstoEmoji.primary900 // Gri renk
  },
  wrongt: {
    backgroundColor: colorstoEmoji.primary800, // Kırmızı renk
  },
  correct: {
    backgroundColor: colorstoEmoji.primary700, // Yeşil renk
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
  },
  // Diğer stil tanımlamalarınız burada yer alabilir
});

export default InfoScreen;
