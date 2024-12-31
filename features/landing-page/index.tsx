import useApi from '@/hooks/useBanana';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { EmptyState } from './empty-state';
import useFetchLandingPage from './hooks/useFetchLandingPage';

export default function Home() {
  const { collections, loading, error } = useFetchLandingPage();

  const {
    onSearchClick,
    onCreateCollection,
    onCollectionClick,
    onDeleteCollection,
  } = useApi();
  const [searchText, setSearchText] = useState<string | null>(null);
  function handleSearchChange(text: string) {
    setSearchText(text);
  }
  function handleSearch() {
    if (searchText === '' || searchText === null) return;
    onSearchClick(searchText);
  }

  function handleCreateCollection(title: string) {
    if (collections.ids.includes(title)) return;
    onCreateCollection(title);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.content]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Discover Your Music</Text>
          <Text style={styles.subtitle}>
            Your personal music journey starts here
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tracks, artists, albums, or playlists..."
            placeholderTextColor="#666"
            onChangeText={handleSearchChange}
            submitBehavior="blurAndSubmit"
            onSubmitEditing={handleSearch}
            value={searchText || ''}
          />
        </View>

        {/* Collections Section */}
        <View style={styles.collectionsContainer}>
          {collections.ids.length > 0 && (
            <Text style={styles.sectionTitle}>Your Collections</Text>
          )}

          {collections.ids.length === 0 ? (
            <EmptyState onCreateCollection={handleCreateCollection} />
          ) : (
            collections.ids.map(collectionId => (
              <TouchableOpacity
                key={collections.byId[collectionId].name}
                onPress={() => onCollectionClick(collectionId)}
                style={styles.collectionButton}
              >
                <View style={[styles.collectionItem]}>
                  <View>
                    <Text style={styles.collectionTitle}>
                      {collections.byId[collectionId].name}
                    </Text>
                    <Text style={styles.collectionTracks}>
                      {collections.byId[collectionId].trackIds.length} tracks
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => onDeleteCollection(collectionId)}
                      disabled={
                        collectionId === 'Uncategorized' ||
                        collectionId === 'All'
                      }
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#666"
                        style={
                          (styles.playButton,
                          {
                            opacity:
                              collectionId === 'Uncategorized' ||
                              collectionId === 'All'
                                ? 0
                                : 1,
                          })
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  collectionButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 40,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    paddingVertical: 12,
  },
  collectionsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e4e4e7',
    marginBottom: 16,
  },
  collectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '100%',
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#e4e4e7',
  },
  collectionTracks: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 4,
  },
  playButton: {
    padding: 12,
  },
});
