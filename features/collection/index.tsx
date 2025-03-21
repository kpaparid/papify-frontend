import List from '@/components/list';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { CreateCollectionModal } from '../landing-page/create-collection';
import { MoreModal } from '../landing-page/more-modal';
import { useCollectionActions } from './hooks/useCollectionActions';
import { useFetchCollectionTracks } from './hooks/useFetchCollections';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useApi from '@/hooks/useBanana';
import { removeTrack } from '@/api/callbacks';

export default function Collection() {
  const { id } = useLocalSearchParams();
  const [addModalIsVisible, setAddModalIsVisible] = React.useState(false);
  const [moreModalIsVisible, setMoreModalIsVisible] = React.useState<{
    visible: boolean;
    activeTabIndex: number | undefined;
  }>({
    visible: false,
    activeTabIndex: undefined,
  });
  const { collection, tracks, image, deviceAlbums, loading, error, fetchData } =
    useFetchCollectionTracks();
  const { onDeleteAllTracks, syncDeviceTracks } = useApi();
  const {
    onDelete,
    onDownload,
    onTrackClick,
    onCreateCollection,
    onToggleCategory,
    onMoveFiles,
  } = useCollectionActions();

  function handleMoveFiles() {
    onMoveFiles(Object.values(tracks.byId));
  }
  function handleDownloadTrack(id: string) {
    const track = tracks.byId[id];
    return onDownload(track);
  }
  const allDeviceTracks = deviceAlbums.byId['All'];
  // console.log(allDeviceTracks);
  // console.log(allDeviceTracks.allIds);
  // console.log(allDeviceTracks.missingIds);
  if (!collection.loaded || !tracks.loaded) return null;

  const tracksByCollection = collection.ids
    .filter(collectionId => collectionId !== 'All' && collectionId !== 'Uncategorized')
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
    onClick: (itemId: string) => onTrackClick(tracks.byId[itemId], collectionId),
    emptyComponent: (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="library-outline" size={32} color={'#a5b3c0'} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>No tracks found</Text>
          <Text style={styles.description}>Start adding tracks to this collection</Text>
        </View>
      </View>
    ),
    items: tracksByCollection[collectionId as 'All'].map(track => ({
      id: track.id,
      isDownloaded: track.storage?.storageId,
      downloadDisabled: true,
      downloadHidden: !deviceAlbums.byId[collectionId].missingIds.includes(track.id),
      deleteDisabled: track.downloading,
      deleteHidden: track.downloading,
      loadingDownload: track.downloading,
      // loadingHidden: track.downloading,
      title: track.spotify.name,
      categories: track.collectionIds,
      mergedCategories: track.collectionIds.join(', '),
      mergedArtists: track.spotify.artists
        .slice(0, 2)
        .map(artist => artist.name)
        .join(', '),
      descriptions: [
        {
          text: track.spotify.artists
            .slice(0, 2)
            .map(artist => artist.name)
            .join(', '),
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
      <MoreModal
        isVisible={moreModalIsVisible.visible}
        onClose={() =>
          setMoreModalIsVisible({ visible: false, activeTabIndex: undefined })
        }
        actions={[
          {
            id: 'delete-all',
            text: 'Delete Tab Tracks',
            onSubmit: () => {
              return onDeleteAllTracks(
                tabs[moreModalIsVisible.activeTabIndex as number].items.map(
                  ({ id }) => id,
                ),
              ).then(() => syncDeviceTracks());
            },
          },
        ]}
      />
      <List
        onMore={({ activeTabIndex }: { activeTabIndex: number }) =>
          setMoreModalIsVisible({ visible: true, activeTabIndex })
        }
        title={'Collections'}
        search
        searchKeys={['title', 'mergedCategories', 'mergedArtists']}
        buttonTabStyle
        // backgroundImage={image.loaded && tracks.ids.length > 0 ? image.url : undefined}
        onAdd={() => setAddModalIsVisible(true)}
        defaultTab={
          tabs.findIndex(tab => tab.title === id) !== -1
            ? tabs.findIndex(tab => tab.title === id)
            : 0
        }
        onRefresh={fetchData}
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
    backgroundColor: '#0d1b2a',
    borderRadius: 50,
    padding: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  description: {
    color: '#a5b3c0',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 300,
  },
});
