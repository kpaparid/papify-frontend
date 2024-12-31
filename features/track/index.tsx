import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MediaControls from './media-controls';
import { useDispatch, useSelector } from 'react-redux';
import { addYtTrack, DataStateType } from '@/utils/redux/dataReducer';
import { getYtTrack } from '@/api/callbacks';
import { useLoadData } from '@/hooks/useLoadData';

import YoutubePlayer from 'react-native-youtube-iframe';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Track() {
  const router = useRouter();
  const [play, setPlay] = useState(false);
  const { id, title, artists } = useLocalSearchParams();

  const dispatch = useDispatch();
  const ytTrackData = useSelector((state: { data: DataStateType }) => {
    console.log({ state });
    return state.data.ytTracks.byId[id as string];
  });

  const handleFetch = useCallback(() => {
    if (!id) return;
    if (ytTrackData) return;
    return getYtTrack(id as string, title as string, artists as string[]).then(
      artist => dispatch(addYtTrack(artist)),
    );
  }, [id]);

  const { loading, error } = useLoadData(handleFetch);
  if (!ytTrackData) return null;

  return (
    <ImageBackground
      source={ytTrackData.images[0]}
      style={styles.container}
      blurRadius={150}
    >
      <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="dark" />

      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-down" size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="more-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* {!play && (
            <Image
              source={ytTrackData.images[0]}
              style={styles.albumArt}
              resizeMode="cover"
            />
          )} */}
        <View style={styles.albumContainer}>
          <View style={styles.container}>
            <YoutubePlayer
              height={250} // Use a small height
              play={play}
              videoId={ytTrackData.youtubeId}
              onChangeState={state => console.log(state)}
            />
          </View>
        </View>

        <View style={styles.songInfo}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{ytTrackData.title}</Text>
          </View>
          <Text style={styles.artist}>{artists}</Text>
          <View style={styles.collectionsContainer}>
            {/* {songData.collections.map((collection, index) => (
              <Text key={index} style={styles.collectionText}>
                {index > 0 ? ' • ' : ''}
                {collection}
              </Text>
            ))} */}
          </View>
        </View>
        <TouchableOpacity onPress={() => setPlay(!play)}>
          <Feather name={play ? 'pause' : 'play'} size={32} color="#fff" />
        </TouchableOpacity>
        <MediaControls duration={15} />
        {/* <MediaControls duration={songData.duration} /> */}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    width: '100%',
    height: '90%',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  albumContainer: {
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.05,
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
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  artist: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
    marginTop: 8,
  },
  collectionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
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
});
