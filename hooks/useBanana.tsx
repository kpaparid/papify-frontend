import {
  deleteCollection,
  deleteTrack,
  getSpotifyAlbum,
  getSpotifyArtist,
  getSpotifyPlaylist,
  getYtTrack,
  toggleTrackCollection,
  postCollection,
  saveTrack,
  searchSpotify,
  removeDeviceTrack,
  getDeviceTracks,
  checkDeviceTracks,
} from '@/api/callbacks';
import {
  addAlbum,
  addArtist,
  addCollection,
  addPlaylist,
  addSearchResult,
  addYtTrack,
  addSavedTrack,
  DataStateType,
  removeCollection,
  removeSavedTrack,
  toggleCollection,
  setDeviceTracks,
} from '@/utils/redux/dataReducer';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
const useApi = () => {
  const router = useRouter();
  const [artistIds, albumIds, playlistIds, trackIds, searchIds, ytTracksIds, trackById, collectionById] = useSelector(
    (state: { data: DataStateType }) => [
      state.data.artists?.ids,
      state.data.albums?.ids,
      state.data.playlists?.ids,
      state.data.tracks?.ids,
      state.data.search?.ids,
      state.data.ytTracks?.ids,
      state.data.tracks?.byId,
      state.data.collection.byId,
    ],
  );
  const dispatch = useDispatch();
  const onAlbumClick = async (id: string) => {
    if (albumIds.includes(id)) return router.push(`/album?id=${id}`);
    return await getSpotifyAlbum(id)
      .then(album => dispatch(addAlbum(album)))
      .then(() => router.push(`/album?id=${id}`));
  };

  const onPlaylistClick = async (id: string) => {
    if (playlistIds.includes(id)) return router.push(`/playlist?id=${id}`);
    return await getSpotifyPlaylist(id)
      .then(playlist => dispatch(addPlaylist(playlist)))
      .then(() => router.push(`/playlist?id=${id}`));
  };

  const onTrackClick = async (id: string, title: string, artists: string[]) => {
    if (ytTracksIds.includes(id)) return router.push(`/track?id=${id}&title=${title}&artists=${artists}`);
    return await getYtTrack(id, title, artists)
      .then(ytTrack => dispatch(addYtTrack(ytTrack)))
      .then(() => router.push(`/track?id=${id}&title=${title}&artists=${artists}`));
  };
  const onArtistClick = async (id: string) => {
    console.log('clicked', artistIds);
    if (artistIds.includes(id)) return router.push(`/artist?id=${id}`);
    return await getSpotifyArtist(id)
      .then(artist => dispatch(addArtist(artist)))
      .then(() => router.push(`/artist?id=${id}`));
  };
  const onSearchClick = async (query: string) => {
    if (searchIds.includes(query)) return router.push(`/search?query=${query}`);
    return await searchSpotify({ query: query })
      .then(searchResult => dispatch(addSearchResult(searchResult)))
      .then(() => router.push(`/search?query=${query}`));
  };

  const onToggleSaveTrack = async (itemId: string, value: boolean) => {
    if (value) {
      return await saveTrack(itemId).then(result => {
        console.log(result);
        return dispatch(addSavedTrack(result));
      });
    } else {
      return await deleteTrack(itemId).then(() => {
        dispatch(removeSavedTrack(itemId));
      });
    }
  };
  const onCreateCollection = async (title: string) => {
    return await postCollection(title).then(result => dispatch(addCollection(result)));
  };
  const onDeleteCollection = async (id: string) => {
    return await deleteCollection(id).then(result => dispatch(removeCollection(result)));
  };
  const onCollectionClick = (id: string) => {
    router.push(`/collection?id=${id}`);
  };
  const onCollectionModeClick = () => {
    console.log('onCollectionModeClick');
    router.push('/collectionList');
  };
  const onCookieClick = () => {
    router.push('/yt-login');
  };
  const onDownloadClick = () => {
    router.push('/download');
  };
  const onToggleCollection = async (spotifyId: string, collectionId: string, value: boolean) => {
    return await toggleTrackCollection(spotifyId, collectionId, value).then(result => {
      dispatch(toggleCollection({ spotifyId, collectionId, value }));
      // return !value && removeDeviceTrack(trackById[spotifyId], [collectionId]);
    });
  };
  const syncDeviceTracks = async () =>
    checkDeviceTracks(Object.values(collectionById)).then(data => dispatch(setDeviceTracks(data)));

  return {
    onAlbumClick,
    onPlaylistClick,
    onTrackClick,
    onArtistClick,
    onSearchClick,
    onCreateCollection,
    onDeleteCollection,
    onCollectionClick,
    onToggleSaveTrack,
    onToggleCollection,
    onCollectionModeClick,
    syncDeviceTracks,
    onCookieClick,
    onDownloadClick,
  };
};

export default useApi;
