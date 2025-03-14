import { DataStateType } from '@/utils/redux/dataReducer';
import { useSelector } from 'react-redux';
import useYoutubePlayer from './youtube-player/useYoutubePlayer';
import useDevicePlayer from './device-player/useDevicePlayer';

export default function useMediaPlayer() {
  const { mediaTrack } = useSelector((state: { data: DataStateType }) => state.data);
  const isDeviceTrack = !!mediaTrack.track?.file;

  const youtubePlayer = useYoutubePlayer(!isDeviceTrack);
  const devicePlayer = useDevicePlayer(isDeviceTrack);

  if (isDeviceTrack)
    return { ...devicePlayer, isAdvertisement: false, renderPlayer: undefined };
  return youtubePlayer;
}
