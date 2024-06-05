import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getTimeUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight - now) / 1000);
};

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const Timer = ({ isVisible }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());

  useEffect(() => {
    let interval;
    if (isVisible) {
      interval = setInterval(() => {
        setTimeLeft(getTimeUntilMidnight());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>Yeni kelimeye kalan süre: {formatTime(timeLeft)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  timerText: {
    fontSize: 18,
    color: '#FFF',
  },
});

export default Timer;
