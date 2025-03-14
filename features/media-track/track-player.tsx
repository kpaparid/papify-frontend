import MediaPlayer from '@/components/media-player';
import MediaModal from '@/components/media-player/media-modal';
import useMediaPlayer from '@/components/media-player/useMediaPlayer';
import { DataStateType } from '@/utils/redux/dataReducer';
import { useSelector } from 'react-redux';

export default function TrackPlayer() {
  const { mediaTrack } = useSelector((state: { data: DataStateType }) => state.data);
  const {
    isLoading,
    isPlaying,
    currentTime,
    duration,
    isAdvertisement,
    onDismiss,
    togglePlay,
    renderPlayer,
    toggleFullScreen,
    fullscreen,
    seekTo,
    onToggleSave,
    isSaved,
    repeat,
    shuffle,
    autoPlay,
    toggleAutoPlay,
    toggleShuffle,
    toggleRepeat,
    onNextTrack,
    onPrevTrack,
  } = useMediaPlayer();

  return (
    <>
      <MediaPlayer
        title={mediaTrack.track?.title as string}
        artists={mediaTrack.track?.artists as string[]}
        image={mediaTrack.track?.image as string}
        loading={mediaTrack.loading}
        isLoading={isLoading}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        isAdvertisement={isAdvertisement}
        onDismiss={onDismiss}
        togglePlay={togglePlay}
        renderPlayer={renderPlayer}
        onClick={toggleFullScreen}
      />
      <MediaModal
        title={mediaTrack.track?.title as string}
        artists={mediaTrack.track?.artists as string[]}
        image={mediaTrack.track?.image as string}
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
