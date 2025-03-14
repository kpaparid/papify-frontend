'use client';

import MediaPlayer from '..';
import MediaModal from '../media-modal';
import useDevicePlayer from './useDevicePlayer';

interface DeviceTrackProps {
  spotifyId: string;
  title: string;
  artists: string[];
  youtubeId: string;
  publish_date: string;
  image: string;
  description: string;
  loading: boolean;
  file: string;
}

export default function DeviceTrack({
  spotifyId,
  title,
  artists,
  youtubeId,
  publish_date,
  image,
  description,
  loading,
  file,
}: DeviceTrackProps) {
  const {
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
  } = useDevicePlayer(`/storage/emulated/0/Music/Papify All/${file}`);

  return (
    <>
      <MediaPlayer
        title={title}
        artists={artists}
        image={image}
        loading={loading}
        isLoading={isLoading}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        isAdvertisement={false}
        onDismiss={onDismiss}
        togglePlay={togglePlay}
        onClick={toggleFullScreen}
      />
      <MediaModal
        title={title}
        artists={artists}
        image={image}
        onClose={toggleFullScreen}
        visible={!!fullscreen}
        onSeek={seekTo}
        currentTime={currentTime}
        totalDuration={duration}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onToggleSave={onToggleSave}
        isSaved={isSaved}
        repeat={repeat}
        shuffle={shuffle}
        autoPlay={autoPlay}
        toggleAutoPlay={toggleAutoPlay}
        toggleShuffle={toggleShuffle}
        toggleRepeat={toggleRepeat}
        onNextTrack={onNextTrack}
        onPrevTrack={onPrevTrack}
      />
    </>
  );
}
