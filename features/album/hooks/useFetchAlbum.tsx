import { getCollectionTracks, getSpotifyAlbum } from '@/api/callbacks';
import { useLoadData } from '@/hooks/useLoadData';
import { AlbumType } from '@/types/album-type';
import CollectionTracksType from '@/types/collection-tracks-type';
import {
  addAlbum,
  DataStateType,
  setCollectionTracks,
} from '@/utils/redux/dataReducer';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useFetchAlbum = (id: string) => {
  const dispatch = useDispatch();
  const [albumData, savedTracks, tracksLoaded]: [AlbumType, string[], boolean] =
    useSelector((state: { data: DataStateType }) => [
      state.data.albums.byId[id as string],
      state.data.tracks.ids,
      state.data.tracks.loaded,
    ]);

  const handleFetch = useCallback(() => {
    if (!id) return;
    if (albumData && tracksLoaded) return;
    return Promise.all([
      albumData ? null : getSpotifyAlbum(id as string),
      tracksLoaded ? null : getCollectionTracks(),
    ]).then(
      ([album, collectionsTracks]: [
        AlbumType | null,
        CollectionTracksType | null,
      ]) => {
        if (album) {
          dispatch(addAlbum(album));
        }
        if (collectionsTracks) {
          dispatch(setCollectionTracks(collectionsTracks));
        }
      },
    );
  }, [id, albumData, tracksLoaded]);

  const { loading, error } = useLoadData(handleFetch);
  return { albumData, tracksLoaded, loading, error, savedTracks };
};
