import { getCollectionTracks, getSpotifyPlaylist } from '@/api/callbacks';
import { useLoadData } from '@/hooks/useLoadData';
import CollectionTracksType from '@/types/collection-tracks-type';
import { PlaylistType } from '@/types/playlist-type';
import {
  addPlaylist,
  DataStateType,
  setCollectionTracks,
} from '@/utils/redux/dataReducer';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useFetchPlaylist = (id: string) => {
  const dispatch = useDispatch();
  const [playlistData, savedTracks, tracksLoaded]: [
    PlaylistType,
    string[],
    boolean,
  ] = useSelector((state: { data: DataStateType }) => [
    state.data.playlists.byId[id as string],
    state.data.tracks.ids,
    state.data.tracks.loaded,
  ]);

  const handleFetch = useCallback(() => {
    if (!id) return;
    if (playlistData && tracksLoaded) return;
    return Promise.all([
      playlistData ? null : getSpotifyPlaylist(id as string),
      tracksLoaded ? null : getCollectionTracks(),
    ]).then(
      ([playlist, collectionsTracks]: [
        PlaylistType | null,
        CollectionTracksType | null,
      ]) => {
        if (playlist) {
          dispatch(addPlaylist(playlist));
        }
        if (collectionsTracks) {
          dispatch(setCollectionTracks(collectionsTracks));
        }
      },
    );
  }, [id, playlistData, tracksLoaded]);

  const { loading, error } = useLoadData(handleFetch);

  return { playlistData, tracksLoaded, loading, error, savedTracks };
};
