import { createDeviceAlbums, downloadTracks, moveFiles2 } from '@/api/callbacks';
import useApi from '@/hooks/useBanana';
import { trackToFileName } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { EmptyState } from './empty-state';
import useFetchLandingPage from './hooks/useFetchLandingPage';
import { BlurView } from 'expo-blur';

export default function Home({ mode }: { mode: boolean }) {
  const { collections, loading, error, deviceAlbums, imageUrl, fetchData } = useFetchLandingPage();
  console.log({ collections });
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  // console.log(collections);
  const {
    onSearchClick,
    onCreateCollection,
    onCollectionClick,
    onCollectionModeClick,
    onDeleteCollection,
    syncDeviceTracks,
    onCookieClick,
    onDownloadClick,
  } = useApi();
  const [searchText, setSearchText] = useState<string | null>(null);
  function handleSearchChange(text: string) {
    setSearchText(text);
  }
  async function handleSearch() {
    if (searchText === '' || searchText === null) return;
    try {
      setSearchLoading(true);
      await onSearchClick(searchText);
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  }
  async function handleCreateDeviceAlbums() {
    return createDeviceAlbums(deviceAlbums).then(() => syncDeviceTracks());
  }

  function handleCreateCollection(title: string) {
    if (collections.ids.includes(title)) return;
    onCreateCollection(title);
  }

  // async function handleDownloadTracks() {
  //   // console.log(data);
  //   const allData = deviceAlbums.byId['All'];
  //   // console.log(allData.missingTracks);
  //   try {
  //     allData?.missingIds?.length > 0 &&
  //       (await downloadTracks(
  //         allData.missingIds.map(id => {
  //           console.log(id);
  //           const track = allData.byId[id];
  //           console.log(track);
  //           return {
  //             id: track.id,
  //             filename: trackToFileName(track.query),
  //           };
  //         }),
  //       ));
  //     console.log('finished downloading');
  //     syncDeviceTracks();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // console.log(device);
  // const deviceTracksNum = deviceAlbums.byId['All'];
  // const deviceTracksNum = deviceAlbums?.find(({ name }) => name === 'All');
  const missingAlbumTracks = Object.values(deviceAlbums.byId)?.filter(({ missingIds }) => missingIds.length > 0).length;
  console.log(deviceAlbums.byId);
  // console.log(Object.values(missingAlbumTracks.byId['All'].byId).some(()));
  return (
    // style={styles.container} contentContainerStyle={styles.contentContainer}
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* <ImageBackground source={{ uri: imageUrl }} style={styles.container} blurRadius={150}> */}
      {/* <BlurView intensity={125} blurReductionFactor={4} style={StyleSheet.absoluteFill} tint="dark" /> */}
      <View style={[styles.content]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Discover Your Music</Text>
          <Text style={styles.subtitle}>Your personal music journey starts here</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          {searchLoading ? (
            <ActivityIndicator color="rgba(255,255,255,0.3)" style={styles.searchIcon} />
          ) : (
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          )}
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color="rgba(255,255,255,0.3)" />
          </View>
        ) : (
          <View style={styles.collectionsContainer}>
            {collections.ids.length === 0 ? (
              <EmptyState onCreateCollection={handleCreateCollection} />
            ) : (
              <>
                <Text style={styles.sectionTitle}>Your Device</Text>
                {/* <NavButton title="Downloads" subtitle="tracks to download" onPress={onDownloadClick} /> */}
                <NavButton title="Yt Cookie" subtitle="Sync Cookie" onPress={onCookieClick} />
                <NavButton
                  title="External Device"
                  subtitle={`Move tracks to External Device`}
                  // onPress={handleCreateDeviceAlbums}
                  nestedIcon={'refresh-outline'}
                  nestedDisabled={collections.byId['All'].tracks.some(({ storage }) => !storage)}
                  onNestedPress={moveFiles2}
                />
                {/* <NavButton
                  title="Tracks"
                  subtitle={
                    deviceTracksNum?.missingIds.length > 0
                      ? `${deviceTracksNum?.missingIds.length} tracks to download `
                      : `All tracks downloaded`
                  }
                  onPress={() => null}
                  nestedIcon={deviceTracksNum?.missingIds.length > 0 ? 'download-outline' : 'checkmark-outline'}
                  onNestedPress={handleDownloadTracks}
                /> */}
                <NavButton
                  title="Albums"
                  subtitle={missingAlbumTracks ? `${missingAlbumTracks} albums need sync` : `All albums synced`}
                  // onPress={handleCreateDeviceAlbums}
                  nestedIcon={missingAlbumTracks ? 'refresh-outline' : 'checkmark-outline'}
                  nestedDisabled={collections.byId['All'].tracks.some(({ storage }) => !storage)}
                  onNestedPress={handleCreateDeviceAlbums}
                />

                <View style={styles.separator} />
                <Text style={styles.sectionTitle}>Your Collections</Text>
                {collections.ids.map(collectionId => (
                  <NavButton
                    key={collections.byId[collectionId].name}
                    title={collections.byId[collectionId].name}
                    subtitle={`${collections.byId[collectionId].tracks.length} tracks`}
                    onPress={() => onCollectionClick(collectionId)}
                    nestedIcon="trash-outline"
                    // nestedDisabled={collectionId === 'Uncategorized' || collectionId === 'All'}
                    onNestedPress={() => {
                      collectionId !== 'Uncategorized' && collectionId !== 'All' && onDeleteCollection(collectionId);
                    }}
                  />
                ))}
              </>
            )}
          </View>
        )}
      </View>
      {/* </ImageBackground> */}
    </ScrollView>
  );
}
const NavButton = ({
  title,
  subtitle,
  onPress,
  onNestedPress,
  nestedIcon,
  nestedDisabled,
}: {
  title: string;
  subtitle: string;
  onPress?: () => void;
  onNestedPress?: () => void | Promise<void>;
  nestedIcon?: keyof typeof Ionicons.glyphMap;
  nestedDisabled?: boolean;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.collectionButton}>
    <View style={[styles.collectionItem]}>
      <View>
        <Text style={styles.collectionTitle}>{title}</Text>
        <Text style={styles.collectionTracks}>{subtitle}</Text>
      </View>
      {onNestedPress && (
        <View>
          <TouchableOpacity onPress={onNestedPress} disabled={nestedDisabled}>
            <Ionicons
              name={nestedIcon}
              size={20}
              color="#666"
              style={(styles.playButton, { opacity: nestedDisabled ? 0.5 : 1 })}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 16,
    width: '100%',
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    paddingBottom: 150,
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
