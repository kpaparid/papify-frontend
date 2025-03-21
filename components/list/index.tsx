import { Feather, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation } from 'expo-router';
import React, { ReactNode, useState } from 'react';
import { searchArray } from './../../utils/helpers';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ListItem from './list-item';
import { ImageWrapper } from '../media-player';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface TrackListType {
  image?: ImageSourcePropType;
  backgroundImage?: ImageSourcePropType;
  title?: string;
  subtitle?: string;
  description?: string[];
  listTitle?: string;
}

export default function List({
  image,
  backgroundImage = image,
  title,
  subtitle,
  description,
  search,
  searchKeys,
  tabs,
  onAdd,
  onMore,
  defaultTab,
  buttonTabStyle,
  onRefresh,
  loaded,
  onImageClick,
}: {
  loaded?: boolean;
  image?: ImageSourcePropType;
  backgroundImage?: ImageSourcePropType;
  title?: string;
  subtitle?: ReactNode;
  description?: string[];
  search?: boolean;
  searchKeys?: string[];
  onAdd?: () => void | Promise<void>;
  onMore?: ({ activeTabIndex }: { activeTabIndex: number }) => void | Promise<void>;
  buttonTabStyle?: boolean;
  defaultTab?: number;
  onRefresh?: () => void | Promise<void>;
  onImageClick?: () => void | Promise<void>;
  tabs?: {
    title?: string;
    onSave?: (id: string) => void | Promise<void>;
    onClick?: (id: string) => void | Promise<void>;
    onDownload?: (id: string) => void | Promise<void>;
    onDelete?: (id: string) => void | Promise<void>;
    emptyComponent?: ReactNode;
    items: {
      id: string;
      title: string;
      isSaved?: boolean;
      isDownloaded?: boolean;
      descriptions?: {
        icon?: string;
        text: string;
      }[];
      imageUrl?: ImageSourcePropType;
      labels?: {
        text: string;
        isActive: boolean;
        onClick?: ({
          id,
          category,
          value,
        }: {
          id: string;
          category: string;
          value: boolean;
        }) => void | Promise<void>;
      }[];
    }[];
  }[];
}) {
  const navigation = useNavigation();
  const [activeTabIndex, setActiveTabIndex] = useState(
    (defaultTab && tabs && tabs?.length > defaultTab && defaultTab) || 0,
  );
  const [searchText, setSearchText] = useState<string | null>(null);

  function handleSearchReset() {
    setSearchText(null);
  }
  function handleSearchChange(text: string) {
    if (text === '') return handleSearchReset();
    setSearchText(text);
  }
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    onRefresh();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const data =
    search && searchText && tabs && searchKeys
      ? searchArray(searchText, tabs[activeTabIndex].items, searchKeys).map(
          ({ item }) => item,
        )
      : tabs?.[activeTabIndex]?.items || [];

  if (loaded !== undefined && !loaded) {
    return (
      <ActivityIndicator
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        color="rgba(255, 255, 255, 0.3)"
        size="large"
      />
    );
  }

  return (
    <ImageWrapper image={backgroundImage} style={[styles.container]}>
      <SafeAreaView style={styles.content}>
        <ScrollView
          refreshControl={
            onRefresh && <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="chevron-left" size={32} color="#fff" />
              </TouchableOpacity>
              {onMore && (
                <TouchableOpacity onPress={() => onMore({ activeTabIndex })}>
                  <Feather name="more-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

            {image && (
              <View style={styles.albumContainer}>
                <TouchableOpacity onPress={onImageClick}>
                  <Image
                    source={{ uri: image }}
                    style={styles.albumArt}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.songInfo}>
              {title && (
                <View style={[styles.titleContainer, onAdd && styles.titleStart]}>
                  <Text style={styles.title}>{title}</Text>
                  {onAdd && (
                    <TouchableOpacity
                      style={[styles.addButton, !image && { backgroundColor: '#0d1b2a' }]}
                      onPress={onAdd}
                    >
                      <Ionicons
                        name="add"
                        size={20}
                        color="#fff"
                        style={styles.addIcon}
                      />
                      <Text style={styles.addButtonText}>Add Collection</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              {description && (
                <Text style={styles.description}>{description?.join(' - ')}</Text>
              )}
            </View>
          </View>
          {search && (
            <View
              style={[styles.searchContainer, !image && { backgroundColor: '#0d1b2a' }]}
            >
              <Ionicons
                name="search"
                size={20}
                color="rgba(255, 255, 255, 0.5)"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search collections..."
                placeholderTextColor={image ? 'rgba(255, 255, 255, 0.5)' : '#a5b3c0'}
                onChangeText={handleSearchChange}
                value={searchText || ''}
              />
              <TouchableOpacity onPress={handleSearchReset}>
                <Ionicons
                  name="close"
                  size={20}
                  color={searchText ? '#666' : 'transparent'}
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            </View>
          )}
          <View>
            {tabs && tabs?.length > 1 && (
              <View style={buttonTabStyle ? styles.buttonContainer : styles.tabContainer}>
                {tabs.map((tab, index) => (
                  <TouchableOpacity
                    key={`tab-${index}`}
                    disabled={searchText !== null}
                    style={[
                      buttonTabStyle ? styles.buttonTab : styles.tab,
                      !image && { backgroundColor: '#1b2837' },
                      activeTabIndex === index &&
                        (buttonTabStyle ? styles.activeButton : styles.activeTab),
                      searchText !== null &&
                        (buttonTabStyle ? styles.disabledButton : styles.disabledTab),
                    ]}
                    onPress={() => setActiveTabIndex(index)}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        { color: image ? 'rgba(255, 255, 255, 0.5)' : '#a5b3c0' },
                        buttonTabStyle && styles.buttonText,
                        activeTabIndex === index &&
                          (buttonTabStyle
                            ? styles.activeButtonText
                            : styles.activeTabText),
                      ]}
                    >
                      {tab.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {tabs &&
              (data.length === 0 && tabs[activeTabIndex]?.emptyComponent
                ? tabs[activeTabIndex].emptyComponent
                : data.map((item, index) => (
                    <ListItem
                      {...item}
                      defaultColoring={!image}
                      onSave={tabs[activeTabIndex].onSave}
                      onDownload={tabs[activeTabIndex].onDownload}
                      onClick={tabs[activeTabIndex].onClick}
                      onDelete={tabs[activeTabIndex].onDelete}
                      key={index}
                    />
                  )))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageWrapper>
  );
}

const styles = StyleSheet.create({
  titleStart: {
    justifyContent: 'space-between',
    marginTop: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addIcon: {
    marginRight: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    // backgroundColor: '#2c2c2e',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
  },
  tabContainer: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },

  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 5,
    maxWidth: '100%',
    overflow: 'scroll',
  },
  buttonTab: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeButton: {
    backgroundColor: '#fff',
    height: 'auto',
  },
  disabledButton: {
    opacity: 0.25,
  },
  buttonText: {
    color: '#fff',
    lineHeight: 16,
  },
  activeButtonText: {
    color: '#000',
  },
  tab: {
    paddingVertical: 15,
    flex: 1,
    // width: width / 4,
    alignItems: 'center',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 500,
  },
  tabContent: {
    padding: 0,
    color: '#fff',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  disabledTab: {
    color: 'rgba(255, 255, 255, 0.5)',
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    opacity: 0.3,
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.5)',
    // color: Colors.dark.mutedForeground,
    fontSize: 14,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    paddingTop: 45,
    // backgroundColor: '#fff',
    width: '100%',
    // height: '90%',
    height: SCREEN_HEIGHT + 45,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 0,
    // paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  albumContainer: {
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  albumArt: {
    width: SCREEN_WIDTH * 0.6,
    // maxWidth: 300,
    // maxHeight: 300,
    height: SCREEN_WIDTH * 0.6,
    borderRadius: 8,
  },
  songInfo: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  collectionText: {
    color: '#fff',
    opacity: 0.6,
    fontSize: 14,
  },
  qualityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 12,
  },
  qualityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  trackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  trackArtist: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
  },
});
