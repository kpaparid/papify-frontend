import { getCollectionTracks } from '@/api/callbacks';
import { useLoadData } from '@/hooks/useLoadData';
import { DataStateType, setCollectionTracks, setImage } from '@/utils/redux/dataReducer';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

export const useFetchDownloadPage = () => {
  const dispatch = useDispatch();

  const tracks = useSelector((state: { data: DataStateType }) => state.data.tracks);
  const image = useSelector((state: { data: DataStateType }) => state.data.image);

  const handleFetch = useCallback(() => {
    return getCollectionTracks().then(collectionTracks => {
      if (!image.loaded) {
        const randomIndex = Math.floor(Math.random() * collectionTracks.tracks.length);
        const randomTrack = collectionTracks.tracks[randomIndex];
        dispatch(setImage(randomTrack.spotify.album.images[0]));
      }

      dispatch(setCollectionTracks(collectionTracks));
    });
  }, [dispatch]);
  const { loading, error, fetchData } = useLoadData(handleFetch);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [image.loaded]);

  return { tracks, loading, image, error, fetchData };
};
