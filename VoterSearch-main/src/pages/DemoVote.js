import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import BackToDashboard from '../components/BackToDashboard';

const candidates = [
  { id: 1, name: 'ABC', party: 'Party A', symbol: '🌸' },
  { id: 2, name: 'XYZ', party: 'Party B', symbol: '🦁' },
  { id: 3, name: 'Your Name', party: 'Independent', symbol: '⭐' }
];

const DemoVote = ({ navigation }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteConfirmed, setVoteConfirmed] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleCandidateSelect = (candidateId) => {
    if (!voteConfirmed) {
      setSelectedCandidate(candidateId);
    }
  };

  const handleVoteConfirm = () => {
    if (selectedCandidate) {
      setVoteConfirmed(true);
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleClear = () => {
    setSelectedCandidate(null);
  };

  const handleReset = () => {
    setSelectedCandidate(null);
    setVoteConfirmed(false);
    setShowResult(false);
  };

  const selectedCandidateName = candidates.find(c => c.id === selectedCandidate)?.name;

  return (
    <ScrollView style={styles.container}>
      <BackToDashboard navigation={navigation} />
      
      <View style={styles.evmMachine}>
        <View style={styles.evmHeader}>
          <Text style={styles.machineTitle}>🗳️ ELECTRONIC VOTING MACHINE</Text>
          <Text style={styles.electionTitle}>DEMO ELECTION 2025</Text>
        </View>

        {!showResult ? (
          <>
            <View style={styles.evmStatus}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusLight, voteConfirmed ? styles.greenLight : styles.blueLight]} />
                <Text style={styles.statusText}>
                  {voteConfirmed ? 'VOTE RECORDED' : 'READY TO VOTE'}
                </Text>
              </View>
            </View>

            <View style={styles.candidatesSection}>
              <Text style={styles.sectionTitle}>SELECT YOUR CANDIDATE</Text>
              <View style={styles.candidatesList}>
                {candidates.map((candidate, index) => (
                  <TouchableOpacity
                    key={candidate.id}
                    style={[
                      styles.candidateRow,
                      selectedCandidate === candidate.id && styles.selectedCandidate,
                      voteConfirmed && styles.disabledCandidate
                    ]}
                    onPress={() => handleCandidateSelect(candidate.id)}
                    disabled={voteConfirmed}
                  >
                    <View style={styles.candidateNumber}>
                      <Text style={styles.numberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.candidateInfo}>
                      <Text style={styles.candidateName}>{candidate.name}</Text>
                      <Text style={styles.candidateParty}>{candidate.party}</Text>
                    </View>
                    <View style={styles.candidateSymbol}>
                      <Text style={styles.symbolText}>{candidate.symbol}</Text>
                    </View>
                    <View style={styles.voteButton}>
                      <View style={[
                        styles.buttonLight,
                        selectedCandidate === candidate.id && styles.redLight
                      ]} />
                      <Text style={styles.buttonText}>VOTE</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.evmControls}>
              <TouchableOpacity 
                style={[styles.controlBtn, styles.clearBtn, voteConfirmed && styles.disabledBtn]} 
                onPress={handleClear}
                disabled={voteConfirmed}
              >
                <Text style={[styles.controlBtnText, voteConfirmed && styles.disabledBtnText]}>CLEAR</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.controlBtn, 
                  styles.voteBtn,
                  (!selectedCandidate || voteConfirmed) && styles.disabledBtn
                ]} 
                onPress={handleVoteConfirm}
                disabled={!selectedCandidate || voteConfirmed}
              >
                <Text style={[
                  styles.controlBtnText,
                  styles.voteBtnText,
                  (!selectedCandidate || voteConfirmed) && styles.disabledBtnText
                ]}>
                  {voteConfirmed ? 'VOTE CAST' : 'CAST VOTE'}
                </Text>
              </TouchableOpacity>
            </View>

            {voteConfirmed && (
              <View style={styles.voteConfirmation}>
                <Text style={styles.confirmationMessage}>
                  ✅ Your vote has been recorded for: <Text style={styles.boldText}>{selectedCandidateName}</Text>
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.voteResult}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>🎉 VOTE SUCCESSFULLY CAST</Text>
            </View>
            <View style={styles.resultDetails}>
              <View style={styles.votedFor}>
                <Text style={styles.votedForLabel}>You voted for:</Text>
                <View style={styles.selectedCandidateResult}>
                  <Text style={styles.resultCandidateText}>
                    {candidates.find(c => c.id === selectedCandidate)?.symbol} {selectedCandidateName}
                  </Text>
                </View>
              </View>
              <View style={styles.thankYou}>
                <Text style={styles.thankYouText}>
                  Thank you for participating in the demo election!
                </Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.controlBtn, styles.resetBtn]} onPress={handleReset}>
              <Text style={[styles.controlBtnText, styles.resetBtnText]}>VOTE AGAIN</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.evmFooter}>
          <Text style={styles.electionInfo}>
            Demo Election Commission of India
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  evmMachine: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  evmHeader: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  machineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  electionTitle: {
    fontSize: 16,
    color: '#93c5fd',
    textAlign: 'center',
  },
  evmStatus: {
    backgroundColor: '#f8fafc',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLight: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  blueLight: {
    backgroundColor: '#3b82f6',
  },
  greenLight: {
    backgroundColor: '#10b981',
  },
  redLight: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  candidatesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 20,
  },
  candidatesList: {
    gap: 15,
  },
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  selectedCandidate: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  disabledCandidate: {
    opacity: 0.6,
  },
  candidateNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  numberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  candidateParty: {
    fontSize: 14,
    color: '#64748b',
  },
  candidateSymbol: {
    marginHorizontal: 15,
  },
  symbolText: {
    fontSize: 32,
  },
  voteButton: {
    alignItems: 'center',
  },
  buttonLight: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  evmControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8fafc',
  },
  controlBtn: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  clearBtn: {
    backgroundColor: '#6b7280',
  },
  voteBtn: {
    backgroundColor: '#10b981',
  },
  resetBtn: {
    backgroundColor: '#3b82f6',
  },
  disabledBtn: {
    backgroundColor: '#d1d5db',
  },
  controlBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  voteBtnText: {
    color: '#fff',
  },
  resetBtnText: {
    color: '#fff',
  },
  disabledBtnText: {
    color: '#9ca3af',
  },
  voteConfirmation: {
    backgroundColor: '#dcfce7',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  confirmationMessage: {
    fontSize: 16,
    color: '#166534',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  voteResult: {
    padding: 20,
    alignItems: 'center',
  },
  resultHeader: {
    marginBottom: 30,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
  },
  resultDetails: {
    alignItems: 'center',
    marginBottom: 30,
  },
  votedFor: {
    alignItems: 'center',
    marginBottom: 20,
  },
  votedForLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 10,
  },
  selectedCandidateResult: {
    backgroundColor: '#fef3c7',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  resultCandidateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400e',
  },
  thankYou: {
    alignItems: 'center',
  },
  thankYouText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  evmFooter: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 15,
    alignItems: 'center',
  },
  electionInfo: {
    fontSize: 14,
    color: '#93c5fd',
    textAlign: 'center',
  },
});

export default DemoVote;