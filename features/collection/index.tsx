import List from '@/components/list';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { CreateCollectionModal } from '../landing-page/create-collection';
import { useCollectionActions } from './hooks/useCollectionActions';
import { useFetchCollectionTracks } from './hooks/useFetchCollections';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Collection() {
  const { id } = useLocalSearchParams();
  const [addModalIsVisible, setAddModalIsVisible] = React.useState(false);
  const { collection, tracks, loading, error } = useFetchCollectionTracks();
  const {
    onDelete,
    onDownload,
    onTrackClick,
    onCreateCollection,
    onToggleCategory,
  } = useCollectionActions();
  function handleDownloadTrack(id: string) {
    const track = tracks.byId[id];
    onDownload(track);
  }

  if (!collection.loaded || !tracks.loaded) return null;

  const tracksByCollection = collection.ids
    .filter(
      collectionId =>
        collectionId !== 'All' && collectionId !== 'Uncategorized',
    )
    .reduce(
      (acc, collectionId) => {
        acc[collectionId] = Object.values(tracks.byId).filter(track =>
          track.collectionIds.includes(collectionId),
        );
        return acc;
      },
      {
        All: Object.values(tracks.byId),
        Uncategorized: Object.values(tracks.byId).filter(
          track => track.collectionIds.length === 0,
        ),
      },
    );
  const collectionIds = Object.keys(tracksByCollection).sort((a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    if (a === 'Uncategorized') return -1;
    if (b === 'Uncategorized') return 1;
    return a.localeCompare(b);
  });
  const tabs = collectionIds.map(collectionId => ({
    title: collectionId,
    onDownload: handleDownloadTrack,
    onDelete,
    onClick: (itemId: string) => onTrackClick(tracks.byId[itemId]),
    emptyComponent: (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="library-outline" size={32} color={'#ffffff80'} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>No tracks found</Text>
          <Text style={styles.description}>
            Start adding tracks to this collection
          </Text>
        </View>
      </View>
    ),
    items: tracksByCollection[collectionId].map(track => ({
      id: track.id,
      title: track.spotify.name,
      categories: track.collectionIds,
      mergedCategories: track.collectionIds.join(', '),
      mergedArtists: track.spotify.artists
        .map(artist => artist.name)
        .join(', '),
      // imageUrl: byId[id].images[0],
      descriptions: [
        {
          text: track.spotify.artists.map(artist => artist.name).join(', '),
        },
      ],
      labels: collection.ids
        .filter(
          (collectionId: string) =>
            collectionId !== 'Uncategorized' && collectionId !== 'All',
        )
        .map((collectionId: string) => ({
          text: collectionId,
          isActive: track.collectionIds.includes(collectionId),
          onClick: onToggleCategory,
        })),
    })),
  }));

  return (
    <>
      <List
        title={'Collections'}
        search
        searchKeys={['title', 'mergedCategories', 'mergedArtists']}
        buttonTabStyle
        backgroundImage={
          tracks.ids.length > 0
            ? tracks.byId[
                tracks.ids[Math.floor(Math.random() * tracks.ids.length)]
              ].spotify.album.images[0]
            : undefined
        }
        onAdd={() => setAddModalIsVisible(true)}
        defaultTab={
          tabs.findIndex(tab => tab.title === id) !== -1
            ? tabs.findIndex(tab => tab.title === id)
            : 0
        }
        tabs={tabs}
      />
      <CreateCollectionModal
        onCreateCollection={onCreateCollection}
        isVisible={addModalIsVisible}
        onClose={() => setAddModalIsVisible(false)}
      />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: '20%',
  },
  iconContainer: {
    backgroundColor: '#18181b66',
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
    maxWidth: 300,
  },
});
