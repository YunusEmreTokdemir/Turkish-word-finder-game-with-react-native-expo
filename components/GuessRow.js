import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colorstoEmoji } from '../constant/color';

const GuessRow = ({ guess, rowIndex, letterStatuses }) => (
  <View style={styles.guessRow}>
    {guess.map((letter, index) => {
      let boxColor;
      switch (letterStatuses[rowIndex][index]) {
        case 'green':
          boxColor = colorstoEmoji.primary700;
          break;
        case 'yellow':
          boxColor = colorstoEmoji.primary800;
          break;
        case 'grey':
          boxColor = colorstoEmoji.primary900;
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

export default GuessRow;
