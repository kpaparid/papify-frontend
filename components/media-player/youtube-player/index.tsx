import {
  DataStateType,
  removeMediaTrack,
  setMediaPlayer,
} from '@/utils/redux/dataReducer';
import { useDispatch, useSelector } from 'react-redux';
import MediaPlayer from '..';
import useYoutubePlayer from './useYoutubePlayer';
import MediaModal from '../media-modal';
import useApi from '@/hooks/useBanana';

interface YtTrackProps {
  spotifyId: string;
  title: string;
  artists: string[];
  youtubeId: string;
  publish_date: string;
  image: string;
  description: string;
  loading: boolean;
}

export default function YtTrack({
  spotifyId,
  title,
  artists,
  youtubeId,
  publish_date,
  image,
  description,
  loading,
}: YtTrackProps) {
  const {
    duration,
    currentTime,
    isAdvertisement,
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
    renderPlayer,
    onDismiss,
    toggleFullScreen,
    seekTo,
    isSaved,
    onToggleSave,
    onNextTrack,
    onPrevTrack,
  } = useYoutubePlayer(youtubeId);

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
        isAdvertisement={isAdvertisement}
        onDismiss={onDismiss}
        togglePlay={togglePlay}
        renderPlayer={renderPlayer}
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
