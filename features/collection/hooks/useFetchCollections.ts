import {
  checkDeviceTracks,
  getCollections,
  getCollectionTracks,
  getDeviceTracks,
} from '@/api/callbacks';
import { useLoadData } from '@/hooks/useLoadData';
import {
  DataStateType,
  setCollectionTracks,
  setDeviceTracks,
} from '@/utils/redux/dataReducer';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
export const useFetchCollectionTracks = () => {
  const dispatch = useDispatch();
  const { collection, tracks, deviceAlbums } = useSelector(
    (state: { data: DataStateType }) => state.data,
  );

  const handleFetch = useCallback(() => {
    if(collection.loaded && tracks.loaded) return checkDeviceTracks(Object.values(collection.byId)).then(data => dispatch(setDeviceTracks(data))) 
    return getCollectionTracks().then((collectionTracks)=>{
      dispatch(setCollectionTracks(collectionTracks));
      return checkDeviceTracks(collectionTracks.collections).then(data => dispatch(setDeviceTracks(data)))
    })
  }, [collection.loaded, tracks.loaded, dispatch]);


  const { loading, error, fetchData } = useLoadData(handleFetch);

  return { collection, tracks, deviceAlbums, loading, error, fetchData };
};
