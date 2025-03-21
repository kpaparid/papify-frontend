import { checkDeviceTracks, getCollections } from '@/api/callbacks';
import { useLoadData } from '@/hooks/useLoadData';
import {
  DataStateType,
  setCollections,
  setDeviceTracks,
} from '@/utils/redux/dataReducer';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useFetchLandingPage() {
  const dispatch = useDispatch();
  const collection = useSelector(
    (state: { data: DataStateType }) => state.data.collection,
  );
  const tracks = useSelector((state: { data: DataStateType }) => state.data.tracks);
  const deviceAlbums = useSelector(
    (state: { data: DataStateType }) => state.data.deviceAlbums,
  );
  const image = useSelector((state: { data: DataStateType }) => state.data.image);

  const handleFetch = useCallback(async () => {
    const collectionData = collection.loaded
      ? Object.values(collection.byId)
      : await getCollections().then(data => {
          dispatch(setCollections(data));
          return data;
        });
    return checkDeviceTracks(collectionData).then(data =>
      dispatch(setDeviceTracks(data)),
    );
  }, [collection]);

  const { loading, error, fetchData } = useLoadData(handleFetch);
  return {
    collections: collection,
    loading,
    error,
    deviceAlbums,
    tracks,
    imageUrl: image.url,
    fetchData,
  };
}
