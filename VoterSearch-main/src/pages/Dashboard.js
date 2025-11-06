import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { VOTER_DATASETS } from '../data/voters';

const Dashboard = ({ navigation, onLogout }) => {
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  // Calculate total voters across all datasets
  const getTotalVoters = () => {
    return Object.values(VOTER_DATASETS).reduce((total, dataset) => {
      return total + dataset.length;
    }, 0);
  };

  // Manual gender counts
  const maleCount = 1854;
  const femaleCount = 1867;

  // Calculate response rate
  const getResponseRate = () => {
    let respondedCount = 0;
    
    Object.entries(VOTER_DATASETS).forEach(([datasetKey, dataset]) => {
      dataset.forEach(voter => {
        const key = `responded_${datasetKey}_${voter.id}`;
        // Check if voter has responded (stored in global.memoryStorage)
        if (typeof global !== 'undefined' && global.memoryStorage && global.memoryStorage[key]) {
          respondedCount++;
        }
      });
    });
    
    return respondedCount;
  };

  const totalVoters = getTotalVoters();
  const responseCount = getResponseRate();

  const menuItems = [
    {
      title: "Voter List",
      icon: "📋",
      path: "SearchVoters",
      description: "Browse and search voter lists",
      color: '#4c51bf'
    },
    {
      title: "Demo Vote",
      icon: "🗳️",
      path: "DemoVote",
      description: "Simulate voting process",
      color: '#2d3748'
    },
    {
      title: "Data Lists",
      icon: "🗂️",
      path: "ListPage",
      description: "View data sheets and reports",
      color: '#2f855a'
    },
    {
      title: "Survey",
      icon: "📊",
      path: "Survey",
      description: "Conduct voter surveys",
      color: '#2c5282'
    },
  ];

  const handleLogout = () => {
    // Call the logout function passed from App.js
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#667eea" barStyle="light-content" />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Feature Cards */}
        <View style={styles.cardsSection}>

          <View style={styles.cardGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.modernCard]}
                onPress={() => navigateToScreen(item.path)}
                activeOpacity={0.85}
              >
                <View style={[styles.cardHeader, { backgroundColor: item.color + '20' }]}>
                  <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                    <Text style={styles.cardIcon}>{item.icon}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.modernCardTitle}>{item.title}</Text>
                  <Text style={styles.modernCardDescription}>{item.description}</Text>
                </View>

                {/* Decorative gradient overlay */}
                <View style={[styles.cardGradientOverlay, {
                  backgroundColor: item.color + '15'
                }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statHeader, { backgroundColor: '#4c51bf' + '20' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: '#4c51bf' }]}>
                  <Text style={styles.statIcon}>👥</Text>
                </View>
              </View>
              <View style={styles.statBody}>
                <Text style={styles.statNumber}>{totalVoters.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Voters</Text>
              </View>
              <View style={[styles.statGradientOverlay, {
                backgroundColor: '#4c51bf' + '15'
              }]} />
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statHeader, { backgroundColor: '#2b6cb0' + '20' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: '#2b6cb0' }]}>
                  <Text style={styles.statIcon}>♂️</Text>
                </View>
              </View>
              <View style={styles.statBody}>
                <Text style={styles.statNumber}>{maleCount.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Male</Text>
              </View>
              <View style={[styles.statGradientOverlay, {
                backgroundColor: '#2b6cb0' + '15'
              }]} />
            </View>
          </View>
          <View style={[styles.statsGrid, { marginTop: 20 }]}>
            <View style={styles.statCard}>
              <View style={[styles.statHeader, { backgroundColor: '#c53030' + '20' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: '#c53030' }]}>
                  <Text style={styles.statIcon}>♀️</Text>
                </View>
              </View>
              <View style={styles.statBody}>
                <Text style={styles.statNumber}>{femaleCount.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Female</Text>
              </View>
              <View style={[styles.statGradientOverlay, {
                backgroundColor: '#c53030' + '15'
              }]} />
            </View>
            <TouchableOpacity 
              style={styles.statCard}
              onPress={() => navigateToScreen('ResponseList')}
              activeOpacity={0.85}
            >
              <View style={[styles.statHeader, { backgroundColor: '#2f855a' + '20' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: '#2f855a' }]}>
                  <Text style={styles.statIcon}>📊</Text>
                </View>
              </View>
              <View style={styles.statBody}>
                <Text style={styles.statNumber}>{responseCount.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Response Rate</Text>
              </View>
              <View style={[styles.statGradientOverlay, {
                backgroundColor: '#2f855a' + '15'
              }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.modernLogoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={styles.logoutContent}>
              <View style={styles.logoutIconContainer}>
                <Text style={styles.logoutEmoji}>👋</Text>
              </View>
              <View style={styles.logoutTextContainer}>
                <Text style={styles.modernLogoutText}>Sign Out</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#f8fafc',
  },

  // Cards Section
  cardsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 24,
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
  },

  // Modern Cards
  modernCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '47%',
    minHeight: 180,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  cardHeader: {
    padding: 20,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  cardIcon: {
    fontSize: 28,
    textAlign: 'center',
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  modernCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1a202c',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
    letterSpacing: 0.2,
    paddingHorizontal: 2,
  },
  modernCardDescription: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
    paddingHorizontal: 4,
  },
  modernCardDescription: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
    paddingHorizontal: 6,
  },

  // Card gradient overlay
  cardGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
    borderRadius: 24,
  },

  // Shine effect
  shineEffect: {
    position: 'absolute',
    top: 0,
    left: '-50%',
    width: '200%',
    height: '50%',
    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
    transform: [{ rotate: '45deg' }],
  },

  // Border glow effect
  borderGlow: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },

  // Stats Section
  statsSection: {
    marginBottom: 30,
    paddingHorizontal: 5,
    backgroundColor: 'transparent',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '47%',
    minHeight: 180,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  statHeader: {
    padding: 20,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  statIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  statIcon: {
    fontSize: 28,
    textAlign: 'center',
  },
  statBody: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a202c',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  statLabel: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
    paddingHorizontal: 4,
  },
  statGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
    borderRadius: 24,
  },

  // Logout Section
  logoutSection: {
    marginTop: 30,
    marginBottom: 40,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modernLogoutButton: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 36,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 0.5,
    borderColor: '#fed7d7',
    minWidth: 200,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIconContainer: {
    marginRight: 12,
  },
  logoutEmoji: {
    fontSize: 22,
  },
  logoutTextContainer: {
    alignItems: 'center',
  },
  modernLogoutText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e53e3e',
    letterSpacing: 0.3,
  },
});

export default Dashboard;
