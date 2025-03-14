import useApi from '@/hooks/useBanana';
import {
  DataStateType,
  removeMediaTrack,
  setMediaPlayer,
  togglePlayedTrack,
} from '@/utils/redux/dataReducer';
import { useCallback, useEffect, useRef, useState } from 'react';

import YoutubePlayer, { PLAYER_STATES } from 'react-native-youtube-iframe';
import { useDispatch, useSelector } from 'react-redux';
export default function useYoutubePlayer(isActive: boolean) {
  const playerRef = useRef<any>(null);

  const dispatch = useDispatch();
  const {
    mediaPlayer: {
      playing,
      currentTime,
      totalDuration,
      fullscreen,
      state,
      loading,
      error,
      repeat,
      autoPlay,
      shuffle,
    },
    spotifyId,
    isSaved,
    mediaTrack,
  } = useSelector((state: { data: DataStateType }) => ({
    mediaPlayer: state.data.mediaPlayer,
    spotifyId: state.data.mediaTrack.track?.spotifyId as string,
    isSaved: state.data.tracks.ids.includes(
      state.data.mediaTrack.track?.spotifyId as string,
    ),
    mediaTrack: state.data.mediaTrack.track,
  }));
  const nextTrack = mediaTrack?.nextTrack;
  const prevTrack = mediaTrack?.prevTrack;
  const [playerLoading, setPlayerLoading] = useState(true);
  const [realState, setRealState] = useState<string>();
  const realLoading =
    realState !== PLAYER_STATES.PLAYING && realState !== PLAYER_STATES.PAUSED;

  const { onToggleSaveTrack, onTrackClick } = useApi();

  const onNextTrack = () => {
    if (nextTrack && mediaTrack) {
      if (repeat) seekTo(0);
      else {
        seekTo(0);
        onTrackClick(
          nextTrack.spotifyId,
          nextTrack.title,
          nextTrack.artists,
          nextTrack.image,
          mediaTrack.source as 'artist' | 'album' | 'playlist' | 'search' | 'collection',
          mediaTrack.sourceId as string,
        );
        setMediaPlayer({ playing: true });
      }
    }
  };
  const onPrevTrack = () => {
    if (prevTrack && mediaTrack) {
      if (repeat) seekTo(0);
      else {
        seekTo(0);
        onTrackClick(
          prevTrack.spotifyId,
          prevTrack.title,
          prevTrack.artists,
          prevTrack.image,
          mediaTrack.source as 'artist' | 'album' | 'playlist' | 'search' | 'collection',
          mediaTrack.sourceId as string,
        );
      }
    }
  };

  const duration = totalDuration;
  const isLoading = realLoading || playerLoading;
  const onError = () => dispatch(setMediaPlayer({ error: true }));

  const isAdvertisement = playing && state !== PLAYER_STATES.PLAYING;
  const isPlaying = (state === PLAYER_STATES.PLAYING || isAdvertisement) && playing;

  const toggleAutoPlay = useCallback(() => {
    dispatch(setMediaPlayer({ autoPlay: !autoPlay }));
  }, [autoPlay]);
  const toggleShuffle = useCallback(() => {
    dispatch(setMediaPlayer({ shuffle: !shuffle }));
  }, [shuffle]);
  const toggleRepeat = useCallback(() => {
    dispatch(setMediaPlayer({ repeat: !repeat }));
  }, [repeat]);

  const togglePlay = useCallback(() => {
    dispatch(setMediaPlayer({ playing: !playing }));
  }, [playing]);
  const onToggleSave = useCallback(
    () => onToggleSaveTrack(spotifyId, !isSaved),
    [isSaved, spotifyId],
  );
  const toggleFullScreen = useCallback(() => {
    dispatch(setMediaPlayer({ fullscreen: !fullscreen }));
  }, [fullscreen]);

  const onEnd = useCallback(() => {
    dispatch(setMediaPlayer({ playing: false }));
    if (!repeat && shuffle) dispatch(togglePlayedTrack(spotifyId));
    if (repeat) {
      seekTo(0);
    }
    if (autoPlay) {
      if (repeat) {
        dispatch(setMediaPlayer({ playing: true }));
      } else {
        onNextTrack();
      }
    }
  }, [autoPlay, shuffle, spotifyId, repeat]);

  const onStateChange = useCallback(
    (state: string) => {
      setRealState(state);
      if (state !== 'buffering') {
        dispatch(setMediaPlayer({ state }));
      }
      if (state === 'ended') {
        onEnd();
      }
      if (state === 'playing' || state === 'paused') {
        dispatch(setMediaPlayer({ loading: false }));
      }
    },
    [repeat, onEnd],
  );
  const onReady = useCallback(() => {
    setPlayerLoading(false);
    dispatch(setMediaPlayer({ loading: false }));
    playerRef.current
      ?.getDuration()
      .then((totalDuration: number) => {
        dispatch(setMediaPlayer({ totalDuration }));
      })
      .catch(console.error);
  }, []);

  const seekTo = useCallback((currentTime: number) => {
    playerRef.current?.seekTo(currentTime, true);
    dispatch(setMediaPlayer({ currentTime }));
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
        playedTracks: [],
      }),
    );
    dispatch(removeMediaTrack());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        playerRef.current
          ?.getDuration()
          .then((totalDuration: number) => dispatch(setMediaPlayer({ totalDuration })))
          .catch(console.error);

        if (isPlaying && state !== 'buffering') {
          playerRef.current
            ?.getCurrentTime()
            .then((currentTime: number) => {
              dispatch(setMediaPlayer({ currentTime }));
            })
            .catch(console.error);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval); // Cleanup on unmount
    };
  }, [isPlaying, state]);

  useEffect(() => {
    if (mediaTrack?.youtubeId && isActive) {
      seekTo(0);
      dispatch(setMediaPlayer({ playing: true }));
    }
  }, [mediaTrack?.youtubeId, isActive]);

  const renderPlayer = () =>
    isActive &&
    mediaTrack?.youtubeId && (
      <YoutubePlayer
        ref={playerRef}
        height={250}
        play={isPlaying}
        videoId={mediaTrack?.youtubeId}
        onChangeState={onStateChange}
        onReady={onReady}
        // onError={() => onError('An error occurred while loading the video.')}
      />
    );
  return {
    playerRef,
    togglePlay,
    toggleRepeat,
    toggleShuffle,
    onStateChange,
    onReady,
    seekTo,
    isPlaying,
    isLoading,
    error,
    currentTime,
    duration,
    repeat,
    isAdvertisement,
    onError,
    renderPlayer,
    onDismiss,
    fullscreen,
    toggleFullScreen,
    onToggleSave,
    isSaved,
    onNextTrack,
    onPrevTrack,
    onEnd,
    shuffle,
    toggleAutoPlay,
    autoPlay,
  };
}
