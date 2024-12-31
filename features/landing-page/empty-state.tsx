import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CreateCollectionModal } from './create-collection';
// import { Library, Plus } from 'react-native-feather';

export function EmptyState({ onCreateCollection }: any) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="library-outline" size={32} color={'#ffffff80'} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>No collections yet</Text>
        <Text style={styles.description}>
          Start building your music collection by creating your first playlist
        </Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={20} color="#fff" style={styles.addIcon} />
        <Text style={styles.addButtonText}>Create Collection</Text>
      </TouchableOpacity>
      <CreateCollectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onCreateCollection={onCreateCollection}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 20,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  iconContainer: {
    backgroundColor: '#18181b',
    borderRadius: 50,
    padding: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    color: '#e4e4e7',
    fontSize: 20,
    fontWeight: '600',
  },
  description: {
    color: '#a1a1aa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 250,
  },
  button: {
    backgroundColor: '#27272a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
