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
      title: "Family Management",
      icon: "👨‍👩‍👧‍👦",
      path: "DemoVote",
      description: "Create and manage voter families",
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
          <View style={styles.statsGrid}>
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
    padding: 16,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
  },

  // Modern Cards
  modernCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '48%',
    height: 170,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    position: 'relative',
  },
  cardHeader: {
    paddingTop: 24,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  cardIcon: {
    fontSize: 26,
    textAlign: 'center',
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
  },
  modernCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  modernCardDescription: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 15,
    fontWeight: '500',
  },

  // Card gradient overlay
  cardGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    opacity: 0.8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  // Shine effect
  shineEffect: {
    position: 'absolute',
    top: 0,
    left: '-50%',
    width: '200%',
    height: '50%',
  },

  // Stats Section
  statsSection: {
    marginBottom: 30,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '48%',
    height: 170,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    position: 'relative',
  },
  statHeader: {
    paddingTop: 24,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  statIcon: {
    fontSize: 26,
    textAlign: 'center',
  },
  statBody: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },
  statGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    opacity: 0.8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  // Logout Section
  logoutSection: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modernLogoutButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
    minWidth: 180,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIconContainer: {
    marginRight: 10,
  },
  logoutEmoji: {
    fontSize: 20,
  },
  logoutTextContainer: {
    alignItems: 'center',
  },
  modernLogoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
    letterSpacing: 0.2,
  },
});

export default Dashboard;
