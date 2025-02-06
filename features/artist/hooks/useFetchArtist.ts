import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpotifyArtist, getCollectionTracks } from '@/api/callbacks';
import { addArtist, DataStateType, setCollectionTracks } from '@/utils/redux/dataReducer';
import { ArtistProfileType } from '@/types/artist-type';

export const useFetchArtist = (id: string) => {
  const dispatch = useDispatch();
  const [artistData, savedTracks, tracksLoaded]: [
    ArtistProfileType,
    string[],
    boolean,
  ] = useSelector((state: { data: DataStateType }) => [
    state.data.artists.byId[id as string],
    state.data.tracks.ids,
    state.data.tracks.loaded,
  ]);

  const handleFetch = useCallback(() => {
    if (!id) return;
    if (artistData && tracksLoaded) return;
    return Promise.all([
      artistData ? null : getSpotifyArtist(id),
      tracksLoaded ? null : getCollectionTracks(),
    ]).then(([artist, collectionsTracks]) => {
      if (artist) {
        dispatch(addArtist(artist));
      }
      if (collectionsTracks) {
        dispatch(setCollectionTracks(collectionsTracks));
      }
    });
  }, [id, artistData, tracksLoaded, dispatch]);

  return { artistData, tracksLoaded, handleFetch, savedTracks };
};