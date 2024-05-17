import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { color } from '../constant/color';

const StatisticsScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    winPercentage: 0,
    bestAttempt: 0,
    currentStreak: 0,
    maxStreak: 0,
    attemptDistribution: [0, 0, 0, 0, 0, 0]
  });

  useEffect(() => {
    const loadStats = async () => {
      const savedStats = await AsyncStorage.getItem('gameStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    };

    loadStats();
  }, []);

  const getAttemptPercentage = (count) => {
    if (stats.wins === 0) return 0;
    return ((count / stats.wins) * 100).toFixed(2);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('ANA SAYFA')}>
        <Ionicons name="home" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>İstatistik</Text>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statsBox}>
          <Text style={styles.statsValue}>{stats.gamesPlayed}</Text>
          <Text style={styles.statsLabel}>OYNANAN</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsValue}>{stats.wins}</Text>
          <Text style={styles.statsLabel}>GALİBİYET</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsValue}>{stats.winPercentage}%</Text>
          <Text style={styles.statsLabel}>GALİBİYET %</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statsBox}>
          <Text style={styles.statsValue}>#{stats.bestAttempt}</Text>
          <Text style={styles.statsLabel}>EN İYİ DENEME</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsValue}>{stats.currentStreak}</Text>
          <Text style={styles.statsLabel}>SERİ GALİBİYET</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsValue}>{stats.maxStreak}</Text>
          <Text style={styles.statsLabel}>SERİ REKORU</Text>
        </View>
      </View>
      <Text style={styles.distributionTitle}>En İyi Deneme</Text>
      <View style={styles.attemptDistribution}>
        {stats.attemptDistribution.map((count, index) => (
          <View key={index} style={styles.distributionRow}>
            <Text style={styles.distributionIndex}>#{index + 1}</Text>
            <View style={styles.distributionBar}>
              <View style={[styles.distributionBarFilled, { width: `${getAttemptPercentage(count)}%` }]} />
            </View>
            <Text style={styles.distributionCount}>{getAttemptPercentage(count)}%</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    marginHorizontal: 5,
  },
  homeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 80,
    left: 15,
    zIndex: 10,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: Platform.OS === 'android' ? 60 : 80,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  statsBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: color.primary300,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 15,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsLabel: {
    fontSize: 16,
    color: 'grey',
  },
  distributionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  attemptDistribution: {
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  distributionIndex: {
    fontSize: 18,
  },
  distributionCount: {
    fontSize: 18,
  },
  distributionBar: {
    flex: 1,
    height: 14,
    marginHorizontal: 15,
    backgroundColor: color.primary300,
    borderRadius: 10,
  },
  distributionBarFilled: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
});

export default StatisticsScreen;
