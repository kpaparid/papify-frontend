import { createDeviceAlbums, moveFiles2 } from '@/api/callbacks';
import useApi from '@/hooks/useBanana';
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { IconSymbolName } from '@/components/ui/IconSymbol';
import { EditCategoryModal } from './edit-category-modal';

export default function Home({ mode }: { mode: boolean }) {
  const { collections, loading, error, deviceAlbums, imageUrl, fetchData } =
    useFetchLandingPage();
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tabView, setTabView] = useState<'card' | 'list'>('card');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const {
    onSearchClick,
    onCreateCollection,
    onCollectionClick,
    onCollectionModeClick,
    onDeleteCollection,
    syncDeviceTracks,
    onCookieClick,
    onGoogleDriveClick,
    onDownloadClick,
    onEditCollection,
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
  const allMissingLength = Object.values(deviceAlbums.byId)?.reduce(
    (acc, { missingIds }) => acc + missingIds.length,
    0,
  );

  const [editCategoryModal, setEditCategoryModal] = useState({
    visible: false,
    collectionId: '',
  });

  return (
    <ScrollView
      /*************  ✨ Codeium Command 🌟  *************/
      style={{ backgroundColor: '#09131d' }}
      // style={{ backgroundColor: '#0d1b2a' }}
      /******  e8e3a61d-06f8-4508-b6b7-50138998334b  *******/
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <EditCategoryModal
        isVisible={editCategoryModal.visible}
        collectionId={editCategoryModal.collectionId}
        onSubmit={newCollectionId =>
          onEditCollection(editCategoryModal.collectionId, newCollectionId)
        }
        onClose={() => setEditCategoryModal({ visible: false, collectionId: '' })}
      />
      <View style={[styles.content, { paddingTop: 50 }]}>
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
            <Ionicons name="search" size={20} color="#777f87" style={styles.searchIcon} />
          )}
          <TextInput
            style={styles.searchInput}
            placeholder="Search tracks, artists, albums, or playlists..."
            placeholderTextColor="#a5b3c0"
            onChangeText={handleSearchChange}
            submitBehavior="blurAndSubmit"
            onSubmitEditing={handleSearch}
            value={searchText || ''}
          />
        </View>

        {/* Collections Section */}
        {loading ? (
          <View style={{ height: '100%', width: '100%' }}>
            <ActivityIndicator
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                margin: 'auto',
              }}
              color="rgba(255, 255, 255, 0.3)"
              size="large"
            />
          </View>
        ) : (
          <View style={styles.collectionsContainer}>
            {collections.ids.length === 0 ? (
              <EmptyState onCreateCollection={handleCreateCollection} />
            ) : (
              <>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 5,
                    paddingBottom: 30,
                  }}
                >
                  <IconButton
                    title="Cookie"
                    onPress={onCookieClick}
                    color="#fb2c36"
                    iconName="youtube"
                    iconType="material-community"
                  />
                  <IconButton
                    title="Tracks"
                    onPress={onGoogleDriveClick}
                    color="#2b7fff"
                    iconName="google-drive"
                    iconType="material-community"
                  />
                  <IconButton
                    title="Move Tracks"
                    onPress={moveFiles2}
                    color="#efb100"
                    iconName="folder-refresh"
                    iconType="material-community"
                  />
                  <IconButton
                    title={allMissingLength + ' Missing'}
                    onPress={handleCreateDeviceAlbums}
                    disabled={collections.byId['All'].tracks.some(
                      ({ storage }) => !storage,
                    )}
                    color="#00c951"
                    iconName="download"
                    iconType="material-community"
                  />
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Text style={styles.sectionTitle}>Your Collections</Text>
                  <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                    <TouchableOpacity
                      onPress={() => setTabView('list')}
                      style={{
                        padding: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        backgroundColor: tabView === 'card' ? '#0c1928' : '#0d1b2a',
                        width: 32,
                        height: 32,
                      }}
                    >
                      <Feather
                        name={'list'}
                        style={[
                          { textAlign: 'center' },
                          tabView !== 'list' && { opacity: 0.5 },
                        ]}
                        size={16}
                        color={'white'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setTabView('card')}
                      style={{
                        padding: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        backgroundColor: tabView === 'list' ? '#0c1928' : '#0d1b2a',
                        width: 32,
                        height: 32,
                      }}
                    >
                      <Feather
                        name={'grid'}
                        style={[
                          { textAlign: 'center' },
                          tabView !== 'card' && { opacity: 0.5 },
                        ]}
                        size={16}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={[
                    tabView === 'card' && {
                      display: 'flex',
                      flexWrap: 'wrap',
                      width: '100%',
                      flexDirection: 'row',
                      gap: tabView === 'card' ? '1%' : 0,
                      justifyContent: 'space-between',
                    },
                  ]}
                >
                  {collections.ids.map(collectionId => (
                    <View
                      key={collections.byId[collectionId].name}
                      style={{ width: tabView === 'card' ? '49%' : '100%' }}
                    >
                      <NavButton
                        title={collections.byId[collectionId].name}
                        subtitle={`${collections.byId[collectionId].tracks.length} tracks`}
                        subtitle2={`${collections.byId[collectionId].tracks.length - deviceAlbums.byId[collectionId].missingIds.length}/${collections.byId[collectionId].tracks.length} tracks`}
                        onPress={() => onCollectionClick(collectionId)}
                        nestedIcon={['pencil', 'trash-outline']}
                        centered={tabView === 'card'}
                        onNestedPress={
                          collectionId === 'Uncategorized' || collectionId === 'All'
                            ? null
                            : [
                                () =>
                                  setEditCategoryModal({ visible: true, collectionId }),
                                () => onDeleteCollection(collectionId),
                              ]
                        }
                      />
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
const IconButton = ({
  title,
  subtitle,
  onPress,
  children,
  iconName,
  iconType,
  color,
  disabled,
}: {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  iconName?: IconSymbolName;
  iconType?: string;
  color: string;
  disabled?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const handlePress = async () => {
    setLoading(true);
    try {
      await onPress?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={{
        padding: 5,
        paddingVertical: 15,
        borderRadius: 10,
        backgroundColor: '#0d1b2a',
        borderColor: '#0b1825',
        borderWidth: 1,
        flex: 1,
      }}
    >
      {loading ? (
        <ActivityIndicator size={32} color="rgba(255,255,255,0.3)" />
      ) : iconType === 'material-community' ? (
        <MaterialCommunityIcons
          name={iconName}
          style={{ textAlign: 'center' }}
          size={32}
          color={color}
        />
      ) : iconType === 'font-awesome' ? (
        <FontAwesome
          name={iconName}
          style={{ textAlign: 'center' }}
          size={32}
          color={color}
        />
      ) : (
        <Feather
          name={iconName}
          style={{ textAlign: 'center' }}
          size={32}
          color={color}
        />
      )}
      <View>
        <Text style={{ paddingTop: 2, textAlign: 'center', color: '#fff', fontSize: 11 }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const NavButton = ({
  title,
  subtitle,
  subtitle2,
  onPress,
  onNestedPress,
  nestedIcon,
  nestedDisabled,
  centered,
}: {
  title: string;
  subtitle: string;
  subtitle2: string;
  onPress?: () => void;
  onNestedPress?: (() => void | Promise<void>)[];
  nestedIcon?: (keyof typeof Ionicons.glyphMap)[];
  nestedDisabled?: boolean;
  centered?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const handleNestedPress = async (index: number) => {
    setLoading(true);
    try {
      await onNestedPress?.[index]();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableOpacity onPress={onPress} style={styles.collectionButton}>
      <View
        style={[
          styles.collectionItem,
          centered ? { marginBottom: '3%' } : { marginBottom: '2%' },
        ]}
      >
        <View style={[centered && { width: '100%' }]}>
          <Text style={[styles.collectionTitle, centered && { textAlign: 'center' }]}>
            {title}
          </Text>
          <Text style={[styles.collectionTracks, , centered && { textAlign: 'center' }]}>
            {centered ? subtitle : subtitle2}
          </Text>
        </View>
        {!centered && onNestedPress && (
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
            {nestedIcon?.map((icon, index) => (
              <View key={`${icon}-${index}`}>
                <TouchableOpacity
                  onPress={() => handleNestedPress(index)}
                  disabled={nestedDisabled}
                >
                  {loading ? (
                    <ActivityIndicator size={'small'} color="#a5b3c0" />
                  ) : (
                    <Ionicons
                      name={icon}
                      size={18}
                      color="#a5b3c0"
                      style={(styles.playButton, { opacity: nestedDisabled ? 0.5 : 1 })}
                    />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: 'hsl(240 6% 20%)',
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
    color: '#a5b3c0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d1b2a',
    borderColor: '#0b1825',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#e1e3e4',
    fontSize: 16,
    paddingVertical: 12,
  },
  collectionsContainer: {
    marginBottom: 42,
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
    marginBottom: 20,
  },
  collectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0d1b2a',
    borderColor: '#0b1825',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#e4e4e7',
  },
  collectionTracks: {
    fontSize: 14,
    color: '#a5b3c0',
    marginTop: 0,
  },
  playButton: {
    padding: 12,
  },
});
