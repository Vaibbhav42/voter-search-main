import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { VOTER_DATASETS } from '../data/voters';
import BackToDashboard from '../components/BackToDashboard';

// Initialize global storage for families
if (!global.memoryStorage) {
  global.memoryStorage = {};
}

const DemoVote = ({ navigation, selectedDataset = 101 }) => {
  const VOTERS = VOTER_DATASETS[selectedDataset] || VOTER_DATASETS[101];
  
  const [familyMembers, setFamilyMembers] = useState([null]); // Start with one empty slot
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMemberIndex, setCurrentMemberIndex] = useState(null);
  const [savedFamilies, setSavedFamilies] = useState([]);

  // Load saved families on mount
  useEffect(() => {
    loadSavedFamilies();
  }, [selectedDataset]);

  const loadSavedFamilies = () => {
    const familiesKey = `families_${selectedDataset}`;
    const families = global.memoryStorage[familiesKey] || [];
    setSavedFamilies(families);
  };

  const handleMemberSelect = (index) => {
    setCurrentMemberIndex(index);
    setModalVisible(true);
    setSearchQuery('');
  };

  const selectVoter = (voter) => {
    const updatedMembers = [...familyMembers];
    updatedMembers[currentMemberIndex] = voter;
    setFamilyMembers(updatedMembers);
    setModalVisible(false);
    setSearchQuery('');
  };

  const addMemberSlot = () => {
    setFamilyMembers([...familyMembers, null]);
  };

  const removeMemberSlot = (index) => {
    if (familyMembers.length > 1) {
      const updatedMembers = familyMembers.filter((_, i) => i !== index);
      setFamilyMembers(updatedMembers);
    }
  };

  const saveFamily = () => {
    // Filter out null/empty slots
    const validMembers = familyMembers.filter(member => member !== null);
    
    if (validMembers.length === 0) {
      Alert.alert('Error', 'Please select at least one family member');
      return;
    }

    const familyData = {
      id: Date.now().toString(),
      members: validMembers,
      createdAt: new Date().toISOString(),
    };

    const familiesKey = `families_${selectedDataset}`;
    const existingFamilies = global.memoryStorage[familiesKey] || [];
    global.memoryStorage[familiesKey] = [...existingFamilies, familyData];

    Alert.alert('Success', 'Family saved successfully!');
    
    // Reset form
    setFamilyMembers([null]);
    loadSavedFamilies();
  };

  const deleteFamily = (familyId) => {
    Alert.alert(
      'Delete Family',
      'Are you sure you want to delete this family?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const familiesKey = `families_${selectedDataset}`;
            const updatedFamilies = savedFamilies.filter(f => f.id !== familyId);
            global.memoryStorage[familiesKey] = updatedFamilies;
            loadSavedFamilies();
          },
        },
      ]
    );
  };

  // Filter voters based on search query
  const filteredVoters = VOTERS.filter(voter => {
    const query = searchQuery.toLowerCase();
    return (
      voter.name?.toLowerCase().includes(query) ||
      voter.voterId?.toLowerCase().includes(query) ||
      voter.Assembly_Part_Sequence?.toLowerCase().includes(query) ||
      voter.mobile?.includes(query)
    );
  });


  return (
    <ScrollView style={styles.container}>
      <BackToDashboard navigation={navigation} />
      
      <View style={styles.header}>
        <Text style={styles.title}>👨‍👩‍👧‍👦 Family Management</Text>
        <Text style={styles.subtitle}>Create and manage voter families</Text>
      </View>

      {/* Add Family Members Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Family Members</Text>
        
        {familyMembers.map((member, index) => (
          <View key={index} style={styles.memberRow}>
            <TouchableOpacity
              style={styles.memberInput}
              onPress={() => handleMemberSelect(index)}
            >
              <Text style={member ? styles.selectedMemberText : styles.placeholderText}>
                {member ? `${member.name} - ${member.voterId}` : 'Tap to select voter'}
              </Text>
            </TouchableOpacity>
            
            {familyMembers.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeMemberSlot(index)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addMemberSlot}>
          <Text style={styles.addButtonText}>+ Add Member</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={saveFamily}>
          <Text style={styles.saveButtonText}>💾 Save Family</Text>
        </TouchableOpacity>
      </View>

      {/* Saved Families Section */}
      {savedFamilies.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Families ({savedFamilies.length})</Text>
          
          {savedFamilies.map((family, familyIndex) => (
            <View key={family.id} style={styles.familyCard}>
              <View style={styles.familyHeader}>
                <Text style={styles.familyTitle}>Family {familyIndex + 1}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteFamily(family.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.familyMembers}>
                {family.members.map((member, memberIndex) => (
                  <View key={memberIndex} style={styles.memberCard}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberDetails}>
                      Voter ID: {member.voterId}
                    </Text>
                    <Text style={styles.memberDetails}>
                      Part Seq: {member.Assembly_Part_Sequence}
                    </Text>
                    {member.mobile && (
                      <Text style={styles.memberDetails}>
                        Mobile: {member.mobile}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
              
              <Text style={styles.familyDate}>
                Created: {new Date(family.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Voter Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Voter</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, voter ID, mobile..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />

            <FlatList
              data={filteredVoters}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.voterItem}
                  onPress={() => selectVoter(item)}
                >
                  <View style={styles.voterInfo}>
                    <Text style={styles.voterName}>{item.name}</Text>
                    <Text style={styles.voterDetails}>
                      ID: {item.voterId} | Part: {item.Assembly_Part_Sequence}
                    </Text>
                    {item.mobile && (
                      <Text style={styles.voterDetails}>Mobile: {item.mobile}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              style={styles.voterList}
              showsVerticalScrollIndicator={true}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No voters found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
  },
  placeholderText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  selectedMemberText: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    width: 40,
    height: 40,
    backgroundColor: '#ef4444',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  familyCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  familyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  familyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 24,
  },
  familyMembers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  memberCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    minWidth: '48%',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  memberDetails: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  familyDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 10,
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#64748b',
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  voterList: {
    maxHeight: 400,
  },
  voterItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  voterInfo: {
    flex: 1,
  },
  voterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  voterDetails: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
  },
});

export default DemoVote;