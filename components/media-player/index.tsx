'use client';

import { Feather } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SwipeToDismiss from '../SwipeToDismiss';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TITLE_FONT_SIZE = 16;
const ARTIST_FONT_SIZE = 14;
const DESCRIPTION_FONT_SIZE = 14;

export default function MediaPlayer({
  title,
  artists,
  image,
  loading,
  isLoading,
  isPlaying,
  currentTime,
  duration,
  isAdvertisement,
  onClick,
  togglePlay,
  onDismiss,
  renderPlayer,
}: {
  title: string;
  artists: string[];
  image: string;
  loading: boolean;
  isLoading: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isAdvertisement?: boolean;
  onClick: () => void;
  togglePlay: () => void;
  onDismiss: () => void;
  renderPlayer?: () => JSX.Element;
}) {
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        // height: 80,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
      }}
    >
      <SwipeToDismiss onDismiss={onDismiss}>
        <TouchableOpacity onPress={onClick}>
          <View style={{ borderTopColor: 'rgba(0, 0, 0, 0.05)', borderTopWidth: 0.5 }}>
            <ImageBackground
              source={{ uri: image }}
              style={{ paddingVertical: 5 }}
              blurRadius={150}
            >
              {image && (
                <BlurView
                  intensity={125}
                  blurReductionFactor={4}
                  style={StyleSheet.absoluteFill}
                  tint="dark"
                />
              )}
              <View style={[styles.albumContainer, { display: 'none' }]}>
                {renderPlayer?.()}
              </View>
              <View style={styles.songInfo}>
                <Image source={{ uri: image }} style={styles.thumbnail} />
                <View style={styles.textInfo}>
                  <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                    {title}
                  </Text>
                  <Text style={styles.date}>{artists.slice(0, 2).join(', ')}</Text>
                </View>
                {isLoading || loading ? (
                  <ActivityIndicator
                    size="large"
                    color="hsl(240 6% 40%)"
                    style={styles.loader}
                  />
                ) : (
                  <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
                    <Feather name={isPlaying ? 'pause' : 'play'} size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 0,
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    marginHorizontal: 8,
                  }}
                >
                  <View
                    style={{
                      width: `${(currentTime / (isAdvertisement ? 15 : duration)) * 100}%`,
                      height: '100%',
                      backgroundColor:
                        isLoading || loading
                          ? 'transparent'
                          : isAdvertisement
                            ? 'yellow'
                            : 'hsl(240 6% 40%)',
                    }}
                  />
                </View>
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      </SwipeToDismiss>
    </View>
  );
}

const styles = StyleSheet.create({
  playButton: {
    width: 40,
    display: 'flex',
    aspectRatio: 1,
    height: '100%',
    backgroundColor: 'hsl(240 6% 20%)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    // position: 'fixed',
    // left: 0,
    // right: 0,
    // bottom: 0,
    // height: 40,
    // backgroundColor: 'red',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumContainer: {
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.02,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  songInfo: {
    // backgroundColor: 'red',
    display: 'flex',
    // backgroundColor: 'red',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: 45,
    height: 45,
    borderRadius: 8,
    marginRight: 15,
  },
  textInfo: {
    flex: 1,
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    fontWeight: 'bold',
    color: '#fff',
    // marginBottom: 5,
  },
  date: {
    fontSize: ARTIST_FONT_SIZE,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  description: {
    fontSize: DESCRIPTION_FONT_SIZE,
    color: '#B3B3B3',
  },
  loader: {
    right: 17.5,
    position: 'absolute',
    zIndex: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 30,
  },
});
