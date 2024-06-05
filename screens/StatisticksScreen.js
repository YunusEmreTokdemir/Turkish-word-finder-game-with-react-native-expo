import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShareButton from '../components/ShareButton';
import { useTheme } from '../theme/ThemeContext';

const StatisticsScreen = ({ navigation }) => {
  const { theme } = useTheme();
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
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('ANA SAYFA')}>
        <Ionicons name="home" size={24} color={theme.textColor} />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: theme.textColor }]}>İstatistik</Text>
      </View>
      <View style={styles.statsRow}>
        <View style={[styles.statsBox, { backgroundColor: theme.buttonColor }]}>
          <Text style={[styles.statsValue, { color: theme.buttonTextColor }]}>{stats.gamesPlayed}</Text>
          <Text style={[styles.statsLabel, { color: theme.textColor }]}>Oynanan</Text>
        </View>
        <View style={[styles.statsBox, { backgroundColor: theme.buttonColor }]}>
          <Text style={[styles.statsValue, { color: theme.buttonTextColor }]}>{stats.wins}</Text>
          <Text style={[styles.statsLabel, { color: theme.textColor }]}>Galibiyet</Text>
        </View>
        <View style={[styles.statsBox, { backgroundColor: theme.buttonColor }]}>
          <Text style={[styles.statsValue, { color: theme.buttonTextColor }]}>{stats.winPercentage}%</Text>
          <Text style={[styles.statsLabel, { color: theme.textColor }]}>Galibiyet %</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={[styles.statsBox, { backgroundColor: theme.buttonColor }]}>
          <Text style={[styles.statsValue, { color: theme.buttonTextColor }]}>#{stats.bestAttempt}</Text>
          <Text style={[styles.statsLabel, { color: theme.textColor }]}>En İyi Deneme</Text>
        </View>
        <View style={[styles.statsBox, { backgroundColor: theme.buttonColor }]}>
          <Text style={[styles.statsValue, { color: theme.buttonTextColor }]}>{stats.currentStreak}</Text>
          <Text style={[styles.statsLabel, { color: theme.textColor }]}>Seri Galibiyet</Text>
        </View>
        <View style={[styles.statsBox, { backgroundColor: theme.buttonColor }]}>
          <Text style={[styles.statsValue, { color: theme.buttonTextColor }]}>{stats.maxStreak}</Text>
          <Text style={[styles.statsLabel, { color: theme.textColor }]}>Seri Rekoru</Text>
        </View>
      </View>
      <Text style={[styles.distributionTitle, { color: theme.textColor }]}>Deneme Dağılımı</Text>
      <View style={styles.attemptDistribution}>
        {stats.attemptDistribution.map((count, index) => (
          <View key={index} style={styles.distributionRow}>
            <Text style={[styles.distributionIndex, { color: theme.textColor }]}>#{index + 1}</Text>
            <View style={styles.distributionBar}>
              <View style={[styles.distributionBarFilled, { width: `${getAttemptPercentage(count)}%` }]}>
                <Text style={[styles.distributionPercentage, { color: theme.textColor }]}>{getAttemptPercentage(count)}%</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <ShareButton stats={stats} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  contentContainer: {
    paddingHorizontal: 15,
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
    height: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  distributionBarFilled: {
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  distributionPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default StatisticsScreen;
