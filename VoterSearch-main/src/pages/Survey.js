import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import BackToDashboard from '../components/BackToDashboard';
import { VOTER_DATASETS } from '../data/voters';

// Simple in-memory storage as fallback
const memoryStorage = {};

export default function Survey({ navigation, selectedDataset = 101 }) {
  const VOTERS = VOTER_DATASETS[selectedDataset] || VOTER_DATASETS[101];
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay for large datasets
  useEffect(() => {
    if (VOTERS.length > 1000) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [VOTERS.length]);

  // Helper functions to get saved data from storage
  const getVoterStatusColor = useCallback((id) => {
    try {
      return memoryStorage[`voterStatusColor_${selectedDataset}_${id}`] || null;
    } catch (e) {
      return null;
    }
  }, [selectedDataset]);

  const getCustomData = useCallback((id) => {
    try {
      const raw = memoryStorage[`voterCustomData_${selectedDataset}_${id}`];
      return raw ? JSON.parse(raw) : { type: null, value: '' };
    } catch (e) {
      return { type: null, value: '' };
    }
  }, [selectedDataset]);

  const getVoterMobile = useCallback((id) => {
    try {
      return memoryStorage[`voterMobile_${selectedDataset}_${id}`];
    } catch (e) {
      return null;
    }
  }, [selectedDataset]);

  // Calculate all voter statistics
  const voterStats = useMemo(() => {
    const stats = {
      total: VOTERS.length,
      favorite: 0,
      doubtful: 0,
      opposite: 0,
      migrant: 0,
      outOfTown: 0,
      dead: 0,
      withMobile: 0,
      withoutMobile: 0,
      male: 0,
      female: 0,
    };

    // Batch process voters for better performance
    for (let i = 0; i < VOTERS.length; i++) {
      const voter = VOTERS[i];
      
      // Check status colors
      const statusColor = getVoterStatusColor(voter.id);
      if (statusColor === '#28a745') stats.favorite++;
      else if (statusColor === '#ffc107') stats.doubtful++;
      else if (statusColor === '#dc3545') stats.opposite++;

      // Check custom status types
      const customData = getCustomData(voter.id);
      if (customData.type === 'Migrant') stats.migrant++;
      else if (customData.type === 'Out Of Town') stats.outOfTown++;
      else if (customData.type === 'Dead') stats.dead++;

      // Check mobile numbers (original + saved)
      const originalMobile = voter.mobile && voter.mobile.trim() !== '';
      const savedMobile = getVoterMobile(voter.id);
      const hasSavedMobile = savedMobile !== undefined && savedMobile.trim() !== '';
      
      if (originalMobile || hasSavedMobile) {
        stats.withMobile++;
      } else {
        stats.withoutMobile++;
      }

      // Check gender
      const gender = voter.gender && voter.gender.toLowerCase();
      if (gender === 'male') {
        stats.male++;
      } else if (gender === 'female') {
        stats.female++;
      }
    }

    return stats;
  }, [VOTERS, selectedDataset, getVoterStatusColor, getCustomData, getVoterMobile]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading voter statistics...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#667eea" barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Back Button */}
        <View style={styles.headerSection}>
          <BackToDashboard navigation={navigation} />
        </View>

        <View style={styles.content}>
          {/* Total Voters Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalEmoji}>👥</Text>
          <View style={styles.totalContent}>
            <Text style={styles.totalLabel}>Total Voters</Text>
            <Text style={styles.totalCount}>{voterStats.total.toLocaleString()}</Text>
          </View>
        </View>

        {/* Status Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Status Categories</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.favoriteCard]}>
              <Text style={styles.statEmoji}>💚</Text>
              <Text style={styles.statLabel}>Favorite</Text>
              <Text style={styles.statCount}>{voterStats.favorite}</Text>
              <Text style={styles.statPercent}>
                {voterStats.total > 0 ? ((voterStats.favorite / voterStats.total) * 100).toFixed(1) : 0}%
              </Text>
            </View>

            <View style={[styles.statCard, styles.doubtfulCard]}>
              <Text style={styles.statEmoji}>💛</Text>
              <Text style={styles.statLabel}>Doubtful</Text>
              <Text style={styles.statCount}>{voterStats.doubtful}</Text>
              <Text style={styles.statPercent}>
                {voterStats.total > 0 ? ((voterStats.doubtful / voterStats.total) * 100).toFixed(1) : 0}%
              </Text>
            </View>

            <View style={[styles.statCard, styles.oppositeCard]}>
              <Text style={styles.statEmoji}>❤️</Text>
              <Text style={styles.statLabel}>Opposite</Text>
              <Text style={styles.statCount}>{voterStats.opposite}</Text>
              <Text style={styles.statPercent}>
                {voterStats.total > 0 ? ((voterStats.opposite / voterStats.total) * 100).toFixed(1) : 0}%
              </Text>
            </View>
          </View>
        </View>

        {/* Special Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏷️ Special Categories</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.migrantCard]}>
              <Text style={styles.statEmoji}>📍</Text>
              <Text style={styles.statLabel}>Migrant</Text>
              <Text style={styles.statCount}>{voterStats.migrant}</Text>
              <Text style={styles.statPercent}>
                {voterStats.total > 0 ? ((voterStats.migrant / voterStats.total) * 100).toFixed(1) : 0}%
              </Text>
            </View>

            <View style={[styles.statCard, styles.outOfTownCard]}>
              <Text style={styles.statEmoji}>🌍</Text>
              <Text style={styles.statLabel}>Out of Town</Text>
              <Text style={styles.statCount}>{voterStats.outOfTown}</Text>
              <Text style={styles.statPercent}>
                {voterStats.total > 0 ? ((voterStats.outOfTown / voterStats.total) * 100).toFixed(1) : 0}%
              </Text>
            </View>

            <View style={[styles.statCard, styles.deadCard]}>
              <Text style={styles.statEmoji}>💀</Text>
              <Text style={styles.statLabel}>Dead</Text>
              <Text style={styles.statCount}>{voterStats.dead}</Text>
              <Text style={styles.statPercent}>
                {voterStats.total > 0 ? ((voterStats.dead / voterStats.total) * 100).toFixed(1) : 0}%
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Contact Information</Text>
          <View style={styles.contactGrid}>
            <View style={[styles.statCard, styles.withMobileCard]}>
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={styles.statLabel}>With Mobile</Text>
              <Text style={styles.statCount}>{voterStats.withMobile}</Text>
              <Text style={styles.statPercent}>
                {voterStats.total > 0 ? ((voterStats.withMobile / voterStats.total) * 100).toFixed(1) : 0}%
              </Text>
            </View>

            <View style={[styles.statCard, styles.withoutMobileCard]}>
              <Text style={styles.statEmoji}>❌</Text>
              <Text style={styles.statLabel}>Without Mobile</Text>
              <Text style={styles.statCount}>{voterStats.withoutMobile}</Text>
              <Text style={styles.statPercent}>
                {voterStats.total > 0 ? ((voterStats.withoutMobile / voterStats.total) * 100).toFixed(1) : 0}%
              </Text>
            </View>
          </View>
        </View>

        {/* Gender Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Gender Distribution</Text>
          <View style={styles.contactGrid}>
            <View style={[styles.statCard, styles.maleCard]}>
              <Text style={styles.statEmoji}>👨</Text>
              <Text style={styles.statLabel}>Male</Text>
              <Text style={styles.statCount}>{voterStats.male}</Text>
              <Text style={styles.statPercent}>
                {voterStats.total > 0 ? ((voterStats.male / voterStats.total) * 100).toFixed(1) : 0}%
              </Text>
            </View>

            <View style={[styles.statCard, styles.femaleCard]}>
              <Text style={styles.statEmoji}>👩</Text>
              <Text style={styles.statLabel}>Female</Text>
              <Text style={styles.statCount}>{voterStats.female}</Text>
              <Text style={styles.statPercent}>
                {voterStats.total > 0 ? ((voterStats.female / voterStats.total) * 100).toFixed(1) : 0}%
              </Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📈 Quick Summary</Text>
          <Text style={styles.summaryText}>
            • Total voters surveyed: {voterStats.total.toLocaleString()}
          </Text>
          <Text style={styles.summaryText}>
            • Status assigned: {(voterStats.favorite + voterStats.doubtful + voterStats.opposite)} voters
          </Text>
          <Text style={styles.summaryText}>
            • Special categories: {(voterStats.migrant + voterStats.outOfTown + voterStats.dead)} voters
          </Text>
          <Text style={styles.summaryText}>
            • Contact coverage: {voterStats.withMobile} voters have mobile numbers
          </Text>
          <Text style={styles.summaryText}>
            • Gender breakdown: {voterStats.male} Male, {voterStats.female} Female
          </Text>
        </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 5,
    alignItems: 'flex-end',
  },
  content: {
    padding: 15,
  },

  // Total Card
  totalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#667eea',
  },
  totalEmoji: {
    fontSize: 28,
    marginRight: 20,
  },
  totalContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    color: '#2d3748',
    fontWeight: '600',
  },
  totalCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },

  // Section Styles
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 18,
    paddingLeft: 5,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  // Stat Card Base
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    alignItems: 'center',
    width: '32%',
    minHeight: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },

  // Status Card Colors
  favoriteCard: {
    borderTopWidth: 5,
    borderTopColor: '#28a745',
  },
  doubtfulCard: {
    borderTopWidth: 5,
    borderTopColor: '#ffc107',
  },
  oppositeCard: {
    borderTopWidth: 5,
    borderTopColor: '#dc3545',
  },

  // Special Category Colors
  migrantCard: {
    borderTopWidth: 5,
    borderTopColor: '#6f42c1',
  },
  outOfTownCard: {
    borderTopWidth: 5,
    borderTopColor: '#20c997',
  },
  deadCard: {
    borderTopWidth: 5,
    borderTopColor: '#6c757d',
  },

  // Contact Card Colors
  withMobileCard: {
    borderTopWidth: 5,
    borderTopColor: '#198754',
    width: '45%',
  },
  withoutMobileCard: {
    borderTopWidth: 5,
    borderTopColor: '#dc3545',
    width: '45%',
  },

  // Gender Card Colors
  maleCard: {
    borderTopWidth: 5,
    borderTopColor: '#007bff',
    width: '45%',
  },
  femaleCard: {
    borderTopWidth: 5,
    borderTopColor: '#e83e8c',
    width: '45%',
  },

  // Stat Card Content
  statEmoji: {
    fontSize: 28,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  statPercent: {
    fontSize: 13,
    color: '#a0aec0',
    fontWeight: '600',
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#f7fafc',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 8,
    lineHeight: 24,
  },
});
