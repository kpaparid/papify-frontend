import { useState, useEffect, useRef, useCallback } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useDispatch, useSelector } from 'react-redux';
import {
  DataStateType,
  removeMediaTrack,
  setMediaPlayer,
  togglePlayedTrack,
} from '@/utils/redux/dataReducer';
import useApi from '@/hooks/useBanana';

export default function useDevicePlayer(isActive: boolean) {
  const soundRef = useRef<Audio.Sound | null>(null);

  const dispatch = useDispatch();
  const {
    mediaPlayer: {
      playing,
      currentTime,
      totalDuration,
      loading,
      error,
      autoPlay,
      shuffle,
      repeat,
      fullscreen,
    },
    spotifyId,
    isSaved,
    mediaTrack,
  } = useSelector((state: { data: DataStateType }) => ({
    mediaPlayer: state.data.mediaPlayer,
    spotifyId: state.data.mediaTrack.track?.spotifyId,
    isSaved: state.data.tracks.ids.includes(
      state.data.mediaTrack.track?.spotifyId as string,
    ),
    mediaTrack: state.data.mediaTrack.track,
  }));
  const nextTrack = mediaTrack?.nextTrack;
  const prevTrack = mediaTrack?.prevTrack;
  const duration = totalDuration;
  const isPlaying = playing;
  const isLoading = loading;
  const onError = () => dispatch(setMediaPlayer({ error: true }));
  const { onToggleSaveTrack, onTrackClick } = useApi();
  const loadAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: `/storage/emulated/0/Music/Papify All/${mediaTrack?.file}` },
        { shouldPlay: false, staysActiveInBackground: false },
        onPlaybackStatusUpdate,
      );
      soundRef.current = sound;

      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        // setDuration(status.durationMillis! / 1000);
        const totalDuration = status.durationMillis! / 1000;
        dispatch(setMediaPlayer({ totalDuration }));
      }

      // setIsLoading(false);
      dispatch(setMediaPlayer({ loading: false }));
      togglePlay();
    } catch (err) {
      dispatch(setMediaPlayer({ loading: false, error: true }));
    }
  };

  const unloadAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      // setError('Audio not loaded');
      dispatch(setMediaPlayer({ error: true }));
      return;
    }

    if (status.isPlaying) {
      const currentTime = status.positionMillis / 1000;
      dispatch(setMediaPlayer({ playing: true, currentTime }));
    } else {
      dispatch(setMediaPlayer({ playing: false }));
    }

    if (status.didJustFinish) {
      fnRef.current.onEnd();
      // dispatch(setMediaPlayer({ playing: false }));
      // seekTo(0);
    }
  };

  const onEnd = useCallback(async () => {
    dispatch(setMediaPlayer({ playing: false }));
    if (!repeat && shuffle) spotifyId && dispatch(togglePlayedTrack(spotifyId));
    if (repeat) {
      seekTo(0);
    }
    if (autoPlay) {
      if (repeat) {
        if (!soundRef.current) return;
        await soundRef.current.playAsync();
        dispatch(setMediaPlayer({ playing: true }));
      } else {
        onNextTrack();
      }
    }
  }, [autoPlay, shuffle, spotifyId, repeat]);
  const fnRef = useRef({ onEnd });
  fnRef.current.onEnd = onEnd;

  const togglePlay = useCallback(async () => {
    if (!soundRef.current) return;

    const status = await soundRef.current.getStatusAsync();

    if (status.isLoaded) {
      if (status.isPlaying) {
        await soundRef.current.pauseAsync();
        dispatch(setMediaPlayer({ playing: false }));
      } else {
        await soundRef.current.playAsync();
        dispatch(setMediaPlayer({ playing: true }));
      }
    }
  }, []);

  const seekTo = useCallback(async (currentTime: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(currentTime * 1000);
      dispatch(setMediaPlayer({ playing: false, currentTime }));
    }
  }, []);

  const onDismiss = useCallback(() => {
    dispatch(
      setMediaPlayer({
        totalDuration: 0,
        currentTime: 0,
        playing: false,
        error: false,
        loading: false,
        fullscreen: false,
      }),
    );
    dispatch(removeMediaTrack());
  }, []);
  const onNextTrack = useCallback(() => {
    if (nextTrack) {
      seekTo(0);
      onTrackClick(
        nextTrack.spotifyId,
        nextTrack.title,
        nextTrack.artists,
        nextTrack.image,
        mediaTrack.source,
        mediaTrack.sourceId,
      );
      dispatch(setMediaPlayer({ playing: true }));
    }
  }, [nextTrack]);

  const onPrevTrack = useCallback(() => {
    if (prevTrack) {
      seekTo(0);
      onTrackClick(
        prevTrack.spotifyId,
        prevTrack.title,
        prevTrack.artists,
        prevTrack.image,
        mediaTrack.source,
        mediaTrack.sourceId,
      );
    }
  }, [prevTrack]);
  const toggleAutoPlay = useCallback(() => {
    dispatch(setMediaPlayer({ autoPlay: !autoPlay }));
  }, [autoPlay]);
  const toggleShuffle = useCallback(() => {
    dispatch(setMediaPlayer({ shuffle: !shuffle }));
  }, [shuffle]);
  const toggleRepeat = useCallback(() => {
    dispatch(setMediaPlayer({ repeat: !repeat }));
  }, [repeat]);

  const onToggleSave = useCallback(
    () => spotifyId && onToggleSaveTrack(spotifyId, !isSaved),
    [isSaved, spotifyId],
  );
  const toggleFullScreen = useCallback(() => {
    dispatch(setMediaPlayer({ fullscreen: !fullscreen }));
  }, [fullscreen]);

  useEffect(() => {
    isActive && loadAudio();
    return () => {
      isActive && unloadAudio(); // Cleanup when unmounting
    };
  }, [isActive, mediaTrack?.file]);

  return {
    duration,
    currentTime,
    isLoading,
    isPlaying,
    repeat,
    shuffle,
    autoPlay,
    fullscreen,
    toggleShuffle,
    toggleAutoPlay,
    toggleRepeat,
    togglePlay,
    onDismiss,
    toggleFullScreen,
    seekTo,
    isSaved,
    onToggleSave,
    onNextTrack,
    onPrevTrack,
  };
}
