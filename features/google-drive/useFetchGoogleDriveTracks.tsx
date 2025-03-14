import { getGoogleDriveTracks } from '@/api/callbacks';
import { useLoadData } from '@/hooks/useLoadData';
import { DataStateType, setGoogleDriveTracks } from '@/utils/redux/dataReducer';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useFetchGoogleDriveTracks = () => {
  const dispatch = useDispatch();

  const googleDriveTracks = useSelector((state: { data: DataStateType }) => state.data.googleDriveTracks);
  const image = useSelector((state: { data: DataStateType }) => state.data.image);

  const handleFetch = useCallback(() => {
    return getGoogleDriveTracks().then(result => dispatch(setGoogleDriveTracks(result)));
  }, [dispatch]);
  const { loading, error, fetchData } = useLoadData(handleFetch);

  return { googleDriveTracks, loading, image, error, fetchData };
};
