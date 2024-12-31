import { getCollections } from '@/api/callbacks';
import { useLoadData } from '@/hooks/useLoadData';
import { DataStateType, setCollections } from '@/utils/redux/dataReducer';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useFetchLandingPage() {
  const dispatch = useDispatch();
  const collections = useSelector(
    (state: { data: DataStateType }) => state.data.collection,
  );

  const handleFetch = useCallback(() => {
    if (collections.loaded) return;
    return getCollections().then(collections =>
      dispatch(setCollections(collections)),
    );
  }, []);

  const { loading, error } = useLoadData(handleFetch);
  return { collections, loading, error };
}
