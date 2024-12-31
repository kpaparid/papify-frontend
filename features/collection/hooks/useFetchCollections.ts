import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCollectionTracks } from '@/api/callbacks';
import { DataStateType, setCollectionTracks } from '@/utils/redux/dataReducer';
import { useLoadData } from '@/hooks/useLoadData';

export const useFetchCollectionTracks = () => {
  const dispatch = useDispatch();
  const { collection, tracks } = useSelector(
    (state: { data: DataStateType }) => state.data,
  );

  const handleFetch = useCallback(() => {
    if (collection.loaded && tracks.loaded) return;
    return getCollectionTracks().then(result =>
      dispatch(setCollectionTracks(result)),
    );
  }, [collection.loaded, tracks.loaded, dispatch]);

  const { loading, error } = useLoadData(handleFetch);

  return { collection, tracks, loading, error };
};