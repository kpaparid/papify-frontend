import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CollectionDotModal({
  downloadAll,
}: {
  downloadAll: () => Promise<void>;
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: false });
  const onOpen = () => setIsModalVisible(true);
  const onClose = () => setIsModalVisible(false);
  const handleDownload = () => {
    setStatus({ loading: true, error: false });
    return downloadAll()
      .then(() => {
        onClose();
        setStatus({ loading: false, error: false });
      })
      .catch(() => setStatus({ loading: false, error: true }));
  };
  return (
    <>
      <TouchableOpacity onPress={onOpen} style={styles.moreButton}>
        <Feather name="more-vertical" size={24} color="#ffffff" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={onClose}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={onClose}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalItem}
              disabled={status?.loading}
              onPress={handleDownload}>
              <Feather name="download" size={20} color="#ffffff" />
              <Text style={styles.modalItemText}>Download All</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  moreButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.dark.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  modalItemText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 16,
    fontWeight: '500',
  },
});
