import { DataStateType } from '@/utils/redux/dataReducer';
import { useSelector } from 'react-redux';
import TrackPlayer from './track-player';

export default function MediaTrack() {
  const { mediaTrack, mediaPlayer } = useSelector(
    (state: { data: DataStateType }) => state.data,
  );
  if (mediaTrack.track) return <TrackPlayer />;
  return null;

  // return (
  //   <>
  //     {mediaTrack.track?.file ? (
  //       <DeviceTrack {...mediaTrack.track} loading={mediaTrack.loading} />
  //     ) : mediaTrack.track ? (
  //       <YtTrack {...mediaTrack.track} loading={mediaTrack.loading} />
  //     ) : null}
  //   </>
  // );
}
