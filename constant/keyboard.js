import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Key = ({ keyVal, onPress, isUsed }) => (
  <TouchableOpacity
    style={[styles.key, isUsed && styles.usedKey]}
    onPress={() => onPress(keyVal)}
  >
    <Text style={[styles.keyText, isUsed && styles.usedKeyText]}>
      {keyVal}
    </Text>
  </TouchableOpacity>
);

const Keyboard = ({ onKeyPress, usedLetters }) => (
  <View style={styles.keyboard}>
    <View style={styles.row}>
      {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'].map((key) => (
        <Key key={key} keyVal={key} onPress={onKeyPress} isUsed={usedLetters[key]} />
      ))}
    </View>
    <View style={styles.row}>
      {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ', 'Â'].map((key) => (
        <Key key={key} keyVal={key} onPress={onKeyPress} isUsed={usedLetters[key]} />
      ))}
    </View>
    <View style={styles.row}>
      <Key key="Backspace" keyVal="⌫" onPress={onKeyPress} />
      {['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç'].map((key) => (
        <Key key={key} keyVal={key} onPress={onKeyPress} isUsed={usedLetters[key]} />
      ))}
      <Key key="Enter" keyVal="✓" onPress={onKeyPress} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  keyboard: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  key: {
    width: 30,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  usedKey: {
    backgroundColor: '#d3d3d3',
    borderColor: '#a9a9a9',
  },
  keyText: {
    fontSize: 24,
    color: '#333333',
  },
  usedKeyText: {
    color: '#a9a9a9',
  },
});

export default Keyboard;
