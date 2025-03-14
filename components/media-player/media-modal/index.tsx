import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { BlurView } from 'expo-blur';
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MediaModal({
  visible,
  onClose,
  image,
  title,
  artists,
  isSaved,
  currentTime,
  totalDuration,
  isPlaying,
  onTogglePlay,
  onToggleSave,
  onSeek,
  repeat,
  shuffle,
  autoPlay,
  toggleShuffle,
  toggleAutoPlay,
  toggleRepeat,
  onNextTrack,
  onPrevTrack,
}: {
  visible: boolean;
  onClose: () => void;
  image: string;
  title: string;
  artists: string[];
  isSaved: boolean;
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onToggleSave: () => void;
  onSeek: (value: number) => void;
  repeat: boolean;
  toggleRepeat: () => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  autoPlay: boolean;
  toggleAutoPlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
}) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ImageBackground
            // source={mediaTrack.track?.image}
            source={{ uri: image }}
            style={styles.container}
            blurRadius={150}
          >
            <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="dark" />
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Feather name="chevron-down" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            {image && (
              <View style={styles.albumContainer}>
                <Image
                  source={{ uri: image }}
                  style={styles.albumArt}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Track Info */}
            <View style={styles.trackInfo}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 20,
                }}
              >
                <View>
                  <Text style={styles.title}>{title}</Text>
                  <Text style={styles.artist}>{artists?.join(', ')}</Text>
                </View>
                <View>
                  <TouchableOpacity style={styles.likeButton} onPress={onToggleSave}>
                    <Ionicons
                      name={isSaved ? 'heart' : 'heart-outline'}
                      size={24}
                      color={
                        isSaved ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <Slider
                  style={styles.progressBar}
                  // value={(currentTime / totalDuration) * 100}
                  value={currentTime}
                  minimumValue={0}
                  maximumValue={totalDuration}
                  minimumTrackTintColor="#fff"
                  maximumTrackTintColor="#ffffff30"
                  thumbTintColor="#fff"
                  onSlidingComplete={number => onSeek(number)}
                />
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                  <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
                </View>
              </View>

              {/* Playback Controls */}
              <View style={styles.controls}>
                <TouchableOpacity style={styles.sideControl} onPress={onPrevTrack}>
                  <Feather name="skip-back" size={24} color="#ffffff80" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.playButton} onPress={onTogglePlay}>
                  <Entypo
                    name={isPlaying ? 'controller-paus' : 'controller-play'}
                    size={30}
                    color="rgba(0, 0, 0, 0.85)"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sideControl} onPress={onNextTrack}>
                  <Feather name="skip-forward" size={24} color="#ffffff80" />
                </TouchableOpacity>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 30 }}>
                <TouchableOpacity onPress={toggleAutoPlay} style={styles.sideControl}>
                  <MaterialCommunityIcons
                    name="refresh-auto"
                    size={20}
                    color={autoPlay ? '#fff' : '#ffffff80'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleShuffle} style={styles.sideControl}>
                  <Feather
                    name="shuffle"
                    size={20}
                    color={shuffle ? '#fff' : '#ffffff80'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleRepeat} style={styles.sideControl}>
                  <Feather
                    name="repeat"
                    size={20}
                    color={repeat ? '#fff' : '#ffffff80'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  likeButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  trackInfo: {
    alignItems: 'center',
    // marginBottom: 30,
    marginTop: 'auto',
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'left',
    // marginBottom: 2,
  },
  artist: {
    color: '#ffffff80',
    fontSize: 14,
    textAlign: 'left',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 30,
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  timeText: {
    color: '#ffffff80',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
    gap: 40,
  },
  sideControl: {
    padding: 10,
  },
  playButton: {
    width: 64,
    height: 64,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  volumeSlider: {
    flex: 1,
    marginLeft: 10,
    height: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    marginTop: 0,
    // paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  albumContainer: {
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.075,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  albumArt: {
    width: SCREEN_WIDTH * 0.8,
    // maxWidth: 300,
    // maxHeight: 300,
    height: SCREEN_WIDTH * 0.8,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  moreButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // minHeight: 400,
  },
  modalContent: {
    height: '100%',
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // padding: 20,
    // paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  modalItemText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 16,
    fontWeight: '500',
  },
});
