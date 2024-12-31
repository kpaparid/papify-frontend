import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MediaControls({ duration }: { duration: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(28); // 0:28 as shown in the image

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `-${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.controls}>
      <Slider
        style={styles.progressBar}
        minimumValue={0}
        maximumValue={duration}
        value={currentTime}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="rgba(255,255,255,0.3)"
        thumbTintColor="#fff"
        onValueChange={setCurrentTime}
      />
      <View style={styles.timeInfo}>
        <Text
          style={
            styles.timeText
          }>{`0:${currentTime < 10 ? '0' : ''}${currentTime}`}</Text>
        <Text style={styles.timeText}>
          {formatTime(duration - currentTime)}
        </Text>
      </View>
      <View style={styles.mainControls}>
        <TouchableOpacity>
          <Feather name="skip-back" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setIsPlaying(!isPlaying)}>
          <Feather name={isPlaying ? 'pause' : 'play'} size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="skip-forward" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  {
    /* <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.bottomButton}>
              <Feather name="share" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton}>
              <Feather name="cast" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton}>
              <Feather name="list" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton}>
              <Feather name="more-horizontal" size={24} color="#fff" />
            </TouchableOpacity>
          </View> */
  }
}
const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  progressBar: {
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
    height: 40,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -10,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    marginTop: 20,
  },
  playButton: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  bottomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
