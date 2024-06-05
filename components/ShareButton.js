import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Share } from 'react-native';

const ShareButton = ({ stats }) => {
  const getAttemptPercentage = (count) => {
    if (stats.wins === 0) return 0;
    return ((count / stats.wins) * 100).toFixed(2);
  };

  const shareStats = async () => {
    try {
      const message = `
        İstatistiklerim:
        Oynanan Oyunlar: ${stats.gamesPlayed}
        Galibiyetler: ${stats.wins}
        Galibiyet Yüzdesi: ${stats.winPercentage}%
        En İyi Deneme: ${stats.bestAttempt}
        Seri Galibiyet: ${stats.currentStreak}
        Seri Rekoru: ${stats.maxStreak}
        Deneme Dağılımı: ${stats.attemptDistribution.map((count, index) => `\n#${index + 1}: ${getAttemptPercentage(count)}%`).join('')}
      `;
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing stats:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.shareButton} onPress={shareStats}>
      <Text style={styles.shareButtonText}>Paylaş</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shareButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 25,
    marginHorizontal: 30,
    marginBottom: 30,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ShareButton;
