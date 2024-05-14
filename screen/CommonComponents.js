import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const GuessRow = ({ guess, letterStatuses }) => (
  <View style={styles.guessRow}>
    {guess.map((letter, index) => {
      let boxColor;
      switch (letterStatuses[index]) {
        case 'green':
          boxColor = '#4CAF50';
          break;
        case 'yellow':
          boxColor = '#FFEB3B';
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

const styles = StyleSheet.create({
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
});
