import { checkDeviceTracks, getCollectionTracks } from '@/api/callbacks';
import { useLoadData } from '@/hooks/useLoadData';
import { DataStateType, setCollectionTracks, setDeviceTracks, setImage } from '@/utils/redux/dataReducer';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useFetchCollectionTracks = () => {
  const dispatch = useDispatch();
  const { collection, tracks, deviceAlbums, image } = useSelector((state: { data: DataStateType }) => state.data);
  const isDownloading = Object.values(tracks.byId).some(({ storage }) => !storage);

  const handleFetch = useCallback(() => {
    if (collection.loaded && tracks.loaded) {
      return checkDeviceTracks(Object.values(collection.byId)).then(data => dispatch(setDeviceTracks(data)));
    }
    return getCollectionTracks().then(collectionTracks => {
      if (!image.loaded) {
        const randomIndex = Math.floor(Math.random() * collectionTracks.tracks.length);
        const randomTrack = collectionTracks.tracks[randomIndex];
        dispatch(setImage(randomTrack.spotify.album.images[0]));
      }
      dispatch(setCollectionTracks(collectionTracks));
      return checkDeviceTracks(collectionTracks.collections).then(data => dispatch(setDeviceTracks(data)));
    });
  }, [collection.loaded, tracks.loaded, image.loaded, dispatch]);

  const { loading, error, fetchData } = useLoadData(handleFetch);

  useEffect(() => {
    const intervalId = setInterval(() => {
      isDownloading &&
        getCollectionTracks().then(collectionTracks => {
          dispatch(setCollectionTracks(collectionTracks));
          return checkDeviceTracks(collectionTracks.collections).then(data => dispatch(setDeviceTracks(data)));
        });
    }, 30000);

    return () => clearInterval(intervalId);
  }, [image.loaded, isDownloading]);

  return { collection, tracks, deviceAlbums, image, loading, error, fetchData };
};
