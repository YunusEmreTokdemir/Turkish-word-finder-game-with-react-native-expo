import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Key = ({ keyVal, onPress }) => (
  <TouchableOpacity style={styles.key} onPress={() => onPress(keyVal)}>
    <Text style={styles.keyText}>{keyVal}</Text>
  </TouchableOpacity>
);

const Keyboard = ({ onKeyPress }) => (
  <View style={styles.keyboard}>
    <View style={styles.row}>
      {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'].map((key) => (
        <Key key={key} keyVal={key} onPress={onKeyPress} />
      ))}
    </View>
    <View style={styles.row}>
      {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ', 'Â'].map((key) => (
        <Key key={key} keyVal={key} onPress={onKeyPress} />
      ))}
    </View>
    <View style={styles.row}>
      <Key key="Backspace" keyVal="⌫" onPress={onKeyPress} />
      {['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç'].map((key) => (
        <Key key={key} keyVal={key} onPress={onKeyPress} />
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
    borderRadius: 10, // Konteynır köşe yuvarlaklığı
    shadowColor: '#000', // Gölge efekti
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  key: {
    width: 30, // Tuş genişliği
    height: 45, // Tuş yüksekliği
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 6, // Tuş köşe yuvarlaklığı
    backgroundColor: '#ffffff', // Tuş rengi
    shadowColor: '#000', // Gölge efekti
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  keyText: {
    fontSize: 24, // Font boyutu
    color: '#333333', // Font rengi
  },
  
  
});

export default Keyboard;
