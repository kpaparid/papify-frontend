import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export function EditCategoryModal({
  isVisible,
  onClose,
  collectionId,
  onSubmit,
}: {
  isVisible: boolean;
  onClose: () => void;
  collectionId: string;
  onSubmit: (newCollectionId: string) => void;
}) {
  const [newCollectionId, setNewCollectionId] = useState(collectionId);

  const handleOnClose = () => {
    setNewCollectionId('');
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(newCollectionId);
    handleOnClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={handleOnClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Collection - {collectionId}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#a1a1aa" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Collection"
            placeholderTextColor="#71717a"
            value={newCollectionId}
            defaultValue={collectionId}
            onChangeText={setNewCollectionId}
            autoFocus
          />
          <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
            <Text style={styles.createButtonText}>Submit</Text>
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
