// LetterCountScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LetterCountScreen = ({ navigation }) => {
  const handleLetterCountPress = (letterCount) => {
    // Burada seçilen harf sayısına göre bir işlem yapabilirsiniz
    // Örneğin, seçilen harf sayısını 'Game' ekranına parametre olarak geçirebilirsiniz
    navigation.navigate('OYUN', { letterCount });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HARF SAYISI SEÇ</Text>
      {[4, 5, 6, 7].map((count) => (
        <TouchableOpacity
          key={count}
          style={styles.button}
          onPress={() => handleLetterCountPress(count)}
        >
          <Text style={styles.buttonText}>{count} HARFLİ</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#007bff',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LetterCountScreen;
