import List from '@/components/list';
import useApi from '@/hooks/useBanana';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useFetchGoogleDriveTracks } from './useFetchGoogleDriveTracks';

export default function GoogleDriveTracks() {
  const { googleDriveTracks, fetchData } = useFetchGoogleDriveTracks();
  const { onDeleteGoogleDriveTrack } = useApi();

  return (
    <List
      title={'Google Drive'}
      search
      searchKeys={['title', 'mergedCategories', 'mergedArtists']}
      buttonTabStyle
      onRefresh={fetchData}
      loaded={googleDriveTracks.loaded}
      tabs={[
        {
          emptyComponent: (
            <View style={styles.container}>
              <View style={styles.iconContainer}>
                <Ionicons name="library-outline" size={32} color={'#ffffff80'} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>No tracks found in google drive</Text>
                <Text style={styles.description}>
                  Start adding tracks to this collection
                </Text>
              </View>
            </View>
          ),
          onDelete: onDeleteGoogleDriveTrack,
          items: googleDriveTracks.ids.map((trackId: string) => {
            const track = googleDriveTracks.byId[trackId];
            return {
              id: track.id,
              isDownloaded: true,
              title: track.name,
              descriptions: [
                {
                  text: `${(track.size / (1024 * 1024)).toFixed(2)} MB`, // Convert size to MB with 2 decimal places
                },
                {
                  text: new Date(track.createdTime).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false, // Use 24-hour format, set to true for AM/PM
                  }),
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
