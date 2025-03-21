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
  ActivityIndicator,
} from 'react-native';

export function MoreModal({
  isVisible,
  onClose,
  actions,
}: {
  isVisible: boolean;
  onClose: () => void;
  actions: {
    id: string;
    text: string;
    onSubmit: () => Promise<void>;
  }[];
}) {
  const [loading, setLoading] = useState<string[]>([]);
  const handleSubmit = async (index: number) => {
    if (actions[index]) {
      const { id, onSubmit } = actions[index];
      setLoading(old => [...old, id]);
      await onSubmit();
      setLoading(old => old.filter(item => item !== id));
      actions.length === 1 && onClose();
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
            <Text style={styles.modalTitle}>Actions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#a1a1aa" />
            </TouchableOpacity>
          </View>
          {actions.map(({ id, text }, index) => (
            <TouchableOpacity
              key={id}
              style={styles.createButton}
              onPress={loading.includes(id) ? undefined : () => handleSubmit(index)}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {loading.includes(id) && (
                  <ActivityIndicator
                    color="white"
                    size="small"
                    animating={loading.includes(id)}
                  />
                )}
                <Text style={styles.createButtonText}>{text}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
