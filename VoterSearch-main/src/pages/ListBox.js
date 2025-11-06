import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
  Linking,
  FlatList,
  Modal,
  Animated,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { VOTER_DATASETS } from '../data/voters';
import Icon from 'react-native-vector-icons/FontAwesome';

// Use the same memory storage as VoterDetail
const memoryStorage = {};

export default function ListBox({ selectedDataset = 101 }) {
  const VOTERS = VOTER_DATASETS[selectedDataset] || VOTER_DATASETS[101];
  const route = useRoute();
  const navigation = useNavigation();
  const { box } = route.params || {};

  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionType, setActionType] = useState(null); // 'download' or 'share'
  const slideAnim = useRef(new Animated.Value(0)).current;

  // --- Helpers ---
  function getVoterStatusColor(id) {
    try {
      return memoryStorage[`voterStatusColor_${selectedDataset}_${id}`] || null;
    } catch (e) {
      return null;
    }
  }

  function getQuickBlue(id) {
    try {
      return memoryStorage[`voterQuickBlue_${selectedDataset}_${id}`] === '1';
    } catch (e) {
      return false;
    }
  }

  function getCustomData(id) {
    try {
      const raw = memoryStorage[`voterCustomData_${selectedDataset}_${id}`];
      return raw ? JSON.parse(raw) : { type: null, value: '' };
    } catch (e) {
      return { type: null, value: '' };
    }
  }

  function getFoundStatus(id) {
    try {
      return memoryStorage[`voterFoundStatus_${selectedDataset}_${id}`] === 'found';
    } catch (e) {
      return false;
    }
  }

  function getVoterMobile(id) {
    try {
      return memoryStorage[`voterMobile_${selectedDataset}_${id}`];
    } catch (e) {
      return null;
    }
  }

  function getStatusText(id) {
    const status = getVoterStatusColor(id);
    if (status === '#28a745') return 'Favorite';
    if (status === '#ffc107') return 'Doubtful';
    if (status === '#dc3545') return 'Opposite';
    if (getQuickBlue(id)) return 'Blue';
    return '-';
  }

  // --- Counting Logic ---
  function computeAllCounts(voters) {
    let counts = {
      'find': 0,
      'not-find': 0,
      'green': 0,
      'yellow': 0,
      'red': 0,
      'blue': 0,
      'migrant': 0,
      'out-of-town': 0,
      'dead': 0,
    };

    for (const v of voters) {
      const hasMobile = !!v.mobile && v.mobile.trim() !== '';
      const savedMobile = getVoterMobile(v.id);
      const hasSavedMobile = savedMobile !== undefined && savedMobile.trim() !== '';
      const isFound = getFoundStatus(v.id);
      
      if (hasMobile || hasSavedMobile || isFound) {
        counts['find'] += 1;
      }

      const status = getVoterStatusColor(v.id);
      const isBlue = getQuickBlue(v.id);
      if (status === '#28a745') counts['green'] += 1;
      else if (status === '#ffc107') counts['yellow'] += 1;
      else if (status === '#dc3545') counts['red'] += 1;
      if (isBlue) counts['blue'] += 1;

      const custom = getCustomData(v.id);
      if (custom.type === 'Migrant') counts['migrant'] += 1;
      else if (custom.type === 'Out Of Town') counts['out-of-town'] += 1;
      else if (custom.type === 'Dead') counts['dead'] += 1;
    }

    counts['not-find'] = voters.length - counts['find'];
    return counts;
  }

  const allCounts = useMemo(() => computeAllCounts(VOTERS), [VOTERS]);

  const BOXES = [
    { key: 'find', title: 'Find', count: allCounts.find },
    { key: 'not-find', title: 'Not Find', count: allCounts['not-find'] },
    { key: 'green', title: 'Favorite', count: allCounts.green },
    { key: 'yellow', title: 'Doubtful', count: allCounts.yellow },
    { key: 'red', title: 'Opposite', count: allCounts.red },
    { key: 'blue', title: 'Blue', count: allCounts.blue },
    { key: 'migrant', title: 'Migrant', count: allCounts.migrant },
    { key: 'out-of-town', title: 'Out-Of-Town', count: allCounts['out-of-town'] },
    { key: 'dead', title: 'Dead', count: allCounts.dead },
  ];

  // --- Filtered Voters ---
  const filtered = useMemo(() => {
    switch (box) {
      case 'find':
        return VOTERS.filter((v) => {
          const hasMobile = !!v.mobile && v.mobile.trim() !== '';
          const savedMobile = getVoterMobile(v.id);
          const hasSavedMobile = savedMobile !== undefined && savedMobile.trim() !== '';
          const isFound = getFoundStatus(v.id);
          return hasMobile || hasSavedMobile || isFound;
        });
      case 'not-find':
        return VOTERS.filter((v) => {
          const hasMobile = !!v.mobile && v.mobile.trim() !== '';
          const savedMobile = getVoterMobile(v.id);
          const hasSavedMobile = savedMobile !== undefined && savedMobile.trim() !== '';
          const isFound = getFoundStatus(v.id);
          return !hasMobile && !hasSavedMobile && !isFound;
        });
      case 'green':
        return VOTERS.filter((v) => getVoterStatusColor(v.id) === '#28a745');
      case 'yellow':
        return VOTERS.filter((v) => getVoterStatusColor(v.id) === '#ffc107');
      case 'red':
        return VOTERS.filter((v) => getVoterStatusColor(v.id) === '#dc3545');
      case 'blue':
        return VOTERS.filter((v) => getQuickBlue(v.id));
      case 'migrant':
        return VOTERS.filter((v) => getCustomData(v.id).type === 'Migrant');
      case 'out-of-town':
        return VOTERS.filter((v) => getCustomData(v.id).type === 'Out Of Town');
      case 'dead':
        return VOTERS.filter((v) => getCustomData(v.id).type === 'Dead');
      default:
        return VOTERS;
    }
  }, [box, VOTERS]);

  const currentBox = BOXES.find((b) => b.key === box);
  const title = currentBox?.title || 'List';
  const titleCount = currentBox?.count !== undefined ? currentBox.count : filtered.length;

  // --- Action Handlers ---
  const openActionModal = (type) => {
    setActionType(type);
    setActionModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeActionModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setActionModalVisible(false);
      setActionType(null);
    });
  };

  // --- Export Functions ---
  const downloadCSV = async () => {
    try {
      const rows = [['Name', 'Voter ID', 'Mobile', 'Status', 'Custom']];
      for (const v of filtered) {
        const statusText = getStatusText(v.id);
        const custom = getCustomData(v.id);
        rows.push([v.name, v.voterId, v.mobile || '', statusText, custom.type ? `${custom.type}: ${custom.value}` : '']);
      }
      const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');

      // In React Native, you might want to share the CSV content or save it to the device
      // For now, let's share it
      await Share.share({
        title: `${title} Export`,
        message: csv,
      });
      closeActionModal();
    } catch (error) {
      Alert.alert('Error', 'Failed to export CSV');
    }
  };

  const shareWhatsApp = async () => {
    try {
      const names = filtered.slice(0, 50).map((v) => v.name).join(', ');
      const text = `List: ${title} (${filtered.length})\n${names}`;
      const url = `whatsapp://send?text=${encodeURIComponent(text)}`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'WhatsApp is not installed');
      }
      closeActionModal();
    } catch (error) {
      Alert.alert('Error', 'Failed to share via WhatsApp');
    }
  };

  const shareEmail = async () => {
    try {
      const subject = `${title} (${filtered.length})`;
      const body = filtered.map((v) => `${v.name} - ${v.voterId} - ${v.mobile || ''}`).join('\n');
      const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No email app installed');
      }
      closeActionModal();
    } catch (error) {
      Alert.alert('Error', 'Failed to share via email');
    }
  };

  // --- Render Item for FlatList ---
  const renderVoterItem = ({ item: v }) => {
    const status = getVoterStatusColor(v.id);
    const blue = getQuickBlue(v.id);
    const custom = getCustomData(v.id);
    const savedMobile = getVoterMobile(v.id);

    let statusText = '-';
    let textColor = '#333';
    if (status === '#28a745') { statusText = 'Favorite'; textColor = '#28a745'; }
    else if (status === '#ffc107') { statusText = 'Doubtful'; textColor = '#ffc107'; }
    else if (status === '#dc3545') { statusText = 'Opposite'; textColor = '#dc3545'; }
    else if (blue) { statusText = 'Blue'; textColor = '#007bff'; }

    // Use saved mobile if available, otherwise use original
    const displayMobile = savedMobile !== undefined ? savedMobile : v.mobile;

    return (
      <TouchableOpacity
        style={styles.voterRow}
        onPress={() => navigation.navigate('VoterDetail', { 
          id: v.id, 
          voter: v, 
          selectedDataset 
        })}
      >
        <View style={styles.voterCell}>
          <Text style={styles.voterText}>{v.name}</Text>
        </View>
        <View style={styles.voterCell}>
          <Text style={styles.voterText}>{v.voterId}</Text>
        </View>
        <View style={styles.voterCell}>
          <Text style={styles.voterText}>{displayMobile || '-'}</Text>
        </View>
        <View style={styles.voterCell}>
          {statusText !== '-' && (
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: blue ? '#007bff' : status }
                ]}
              />
              <Text style={[styles.statusText, { color: textColor }]}>
                {statusText}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.voterCell}>
          <Text style={styles.voterText}>
            {custom.type ? `${custom.type}: ${custom.value}` : '-'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {title} <Text style={styles.count}>({titleCount})</Text>
        </Text>
        <View style={styles.actionButtons}>
          {/* Download Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton]}
            onPress={() => openActionModal('download')}
          >
            <Text style={[styles.actionButtonText, styles.downloadButtonText]}>📥 Download</Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={() => openActionModal('share')}
          >
            <Text style={[styles.actionButtonText, styles.shareButtonText]}>🔁 Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Voter Table */}
      <View style={styles.tableContainer}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No voters in this category.</Text>
          </View>
        ) : (
          <>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Name</Text>
              <Text style={styles.headerText}>Voter ID</Text>
              <Text style={styles.headerText}>Mobile</Text>
              <Text style={styles.headerText}>Status</Text>
              <Text style={styles.headerText}>Custom</Text>
            </View>

            {/* Voter List */}
            <FlatList
              data={filtered}
              renderItem={renderVoterItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.voterList}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
      
        <Text style={styles.backButtonText}>⬅️ Back to Data Sheets</Text>
      </TouchableOpacity>

      {/* Action Modal */}
      <Modal
        visible={actionModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeActionModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeActionModal}
        >
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalTranslateY }] }
            ]}
          >
            {actionType === 'download' && (
              <>
                <TouchableOpacity style={styles.modalOption} onPress={downloadCSV}>
                  <Text style={styles.modalOptionText}>Export as CSV</Text>
                </TouchableOpacity>
                <View style={styles.modalSeparator} />
                <TouchableOpacity style={styles.modalOption} onPress={closeActionModal}>
                  <Text style={[styles.modalOptionText, styles.cancelText]}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}

            {actionType === 'share' && (
              <>
                <TouchableOpacity style={styles.modalOption} onPress={shareWhatsApp}>
                  <View style={styles.modalOptionWithIcon}>
                    <Icon name="whatsapp" size={20} color="#25D366" />
                    <Text style={styles.modalOptionText}>WhatsApp</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.modalSeparator} />
                <TouchableOpacity style={styles.modalOption} onPress={shareEmail}>
                  <View style={styles.modalOptionWithIcon}>
                    <Icon name="envelope" size={20} color="#EA4335" />
                    <Text style={styles.modalOptionText}>Email</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.modalSeparator} />
                <TouchableOpacity style={styles.modalOption} onPress={closeActionModal}>
                  <Text style={[styles.modalOptionText, styles.cancelText]}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  count: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'normal',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    justifyContent: 'center',
    minWidth: 90,
  },
  downloadButton: {
    backgroundColor: '#28a745',
    borderWidth: 0,
  },
  shareButton: {
    backgroundColor: '#007bff',
    borderWidth: 0,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 13,
  },
  downloadButtonText: {
    color: '#fff',
  },
  shareButtonText: {
    color: '#fff',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
    elevation: 4,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
  },
  voterList: {
    flex: 1,
  },
  voterRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f6f6f6',
    paddingVertical: 8,
  },
  voterCell: {
    flex: 1,
    justifyContent: 'center',
  },
  voterText: {
    fontSize: 14,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalOption: {
    paddingVertical: 16,
  },
  modalOptionWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalOptionText: {
    fontSize: 18,
    color: '#007bff',
  },
  cancelText: {
    color: '#dc3545',
    textAlign: 'center',
  },
  modalSeparator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
});