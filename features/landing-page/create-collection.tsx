import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface CreateCollectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateCollection: (title: string) => void;
}

export function CreateCollectionModal({
  isVisible,
  onClose,
  onCreateCollection,
}: CreateCollectionModalProps) {
  const [collectionTitle, setCollectionTitle] = useState('');

  const handleCreateCollection = () => {
    if (collectionTitle.trim()) {
      onCreateCollection(collectionTitle.trim());
      setCollectionTitle('');
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Collection</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#a1a1aa" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Collection Title"
            placeholderTextColor="#71717a"
            value={collectionTitle}
            onChangeText={setCollectionTitle}
            submitBehavior="blurAndSubmit"
            autoFocus
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateCollection}
          >
            <Text style={styles.createButtonText}>Create Collection</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#18181b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    // minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  input: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#3f3f46',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
