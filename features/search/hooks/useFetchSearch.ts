import { getCollectionTracks, searchSpotify } from '@/api/callbacks';
import { useLoadData } from '@/hooks/useLoadData';
import CollectionTracksType from '@/types/collection-tracks-type';
import { SearchResultType } from '@/types/search-types';
import {
  addSearchResult,
  DataStateType,
  setCollectionTracks,
} from '@/utils/redux/dataReducer';
import { useCallback } from 'react';
import { ImageSourcePropType } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const useFetchSearch = (query: string) => {
  const dispatch = useDispatch();
  const [searchResult, loaded, tracksLoaded, savedTracks, imageUrl]: [
    SearchResultType,
    boolean,
    boolean,
    string[],
    string | ImageSourcePropType
  ] = useSelector((state: { data: DataStateType }) => [
    state.data.search.byId[query as string],
    state.data.search.loaded,
    state.data.tracks.loaded,
    state.data.tracks.ids,
    state.data.image.url
  ]);

  const handleFetch = useCallback(async () => {
    if (!query) return;
    if ((searchResult || loaded) && tracksLoaded) return;

    return Promise.all([
      searchResult ? null : searchSpotify({ query } as { query: string }),
      tracksLoaded ? null : getCollectionTracks(),
    ]).then(
      ([searchResult, collectionsTracks]: [
        SearchResultType | null,
        CollectionTracksType | null,
      ]) => {
        if (searchResult) {
          dispatch(addSearchResult(searchResult));
        }
        if (collectionsTracks) {
          dispatch(setCollectionTracks(collectionsTracks));
        }
      },
    );
  }, [query, tracksLoaded, searchResult, loaded, dispatch]);

  const { loading, error } = useLoadData(handleFetch);

  if (!searchResult || loading) return { loading, error, searchResult: null, savedTracks, imageUrl };

  const { id, topResult, tracks, albums, playlists, artists } = searchResult;

  return {
    loading,
    error,
    savedTracks,
    searchResult: { id, topResult, tracks, albums, playlists, artists },
    imageUrl
  };
};

export default useFetchSearch;
