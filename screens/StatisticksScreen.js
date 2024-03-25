import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function StatisticksScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="home" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.text}>İstatistikler</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 80, // Adjust the value as needed for your layout
    left: 20,
    zIndex: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  // ... any other styles you have ...
});

export default StatisticksScreen;
