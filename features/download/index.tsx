import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useFetchDownloadPage } from './useFetchDownloadPage';
import List from '@/components/list';
import { Ionicons } from '@expo/vector-icons';
import { DataStateType } from '@/utils/redux/dataReducer';

export default function Download() {
  const { loading, error, image, tracks, fetchData } = useFetchDownloadPage();

  return (
    <List
      title={'Tracks'}
      search
      searchKeys={['title', 'mergedCategories', 'mergedArtists']}
      buttonTabStyle
      backgroundImage={image.loaded && tracks.ids.length > 0 ? image.url : undefined}
      onRefresh={fetchData}
      tabs={[
        {
          emptyComponent: (
            <View style={styles.container}>
              <View style={styles.iconContainer}>
                <Ionicons name="library-outline" size={32} color={'#ffffff80'} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>No tracks found</Text>
                <Text style={styles.description}>Start adding tracks to this collection</Text>
              </View>
            </View>
          ),
          onDownload: () => {},
          items: tracks.ids.map((trackId: string) => {
            const track = tracks.byId[trackId];
            return {
              id: track.id,
              //   isSaved: true,
              //   isDownloaded: false,
              isDownloaded: false,
              // isDownloaded: track.storage?.storageId,
              title: track.spotify.name,
              categories: track.collectionIds,
              mergedCategories: track.collectionIds.join(', '),
              mergedArtists: track.spotify.artists.map(artist => artist.name).join(', '),
              descriptions: [
                {
                  text: track.spotify.artists.map(artist => artist.name).join(', '),
                },
              ],
            };
          }),
        },
      ]}
    />
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
