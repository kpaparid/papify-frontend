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
  removeGoogleDriveTrack,
  putCollection,
} from '@/api/callbacks';
import { CollectionType } from '@/types/collection-type';
import { DeviceAlbumType } from '@/types/device-album-type';
import { SavedTrackType } from '@/types/saved-track-type';
import { YtTrackType } from '@/types/ytTrack-type';
import {
  addAlbum,
  addArtist,
  addCollection,
  editCollection,
  addPlaylist,
  addSearchResult,
  addYtTrack,
  addSavedTrack,
  DataStateType,
  removeCollection,
  removeSavedTrack,
  toggleCollection,
  setDeviceTracks,
  deleteGoogleDriveTrack,
  setMediaTrack,
  setMediaTrackLoading,
} from '@/utils/redux/dataReducer';
import { useRouter } from 'expo-router';
import { ImageSourcePropType } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
const useApi = () => {
  const router = useRouter();
  const [
    artistIds,
    albumIds,
    playlistIds,
    trackIds,
    searchIds,
    ytTracksIds,
    trackById,
    collectionById,
    ytTracksById,
    deviceAlbumsById,
  ]: [
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    { [key: string]: SavedTrackType },
    { [key: string]: CollectionType },
    { [key: string]: YtTrackType },
    { [key: string]: DeviceAlbumType },
  ] = useSelector((state: { data: DataStateType }) => [
    state.data.artists?.ids,
    state.data.albums?.ids,
    state.data.playlists?.ids,
    state.data.tracks?.ids,
    state.data.search?.ids,
    state.data.ytTracks?.ids,
    state.data.tracks?.byId,
    state.data.collection.byId,
    state.data.ytTracks?.byId,
    state.data.deviceAlbums.byId,
  ]);
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

  const onTrackClick = async (
    id: string,
    title: string,
    artists: string[],
    image: ImageSourcePropType,
    source: 'artist' | 'album' | 'playlist' | 'search' | 'collection',
    sourceId: string,
  ) => {
    const savedTrack = trackById[id] as SavedTrackType;
    if (!savedTrack) {
      dispatch(
        setMediaTrackLoading({
          spotifyId: id,
          title,
          artists,
          image,
          source,
          sourceId,
        }),
      );
      return await getYtTrack(id, title, artists).then(ytTrack => {
        dispatch(addYtTrack(ytTrack));
        dispatch(
          setMediaTrack({
            youtubeId: ytTrack.youtubeId,
            image,
            spotifyId: id,
            description: ytTrack.description,
            title,
            artists,
            publish_date: ytTrack.publish_date,
            source,
            sourceId,
          }),
        );
        // return router.push(
        //   `/track?id=${id}&title=${title}&artists=${artists}&ytTrack=${ytTrack.youtubeId}&description=${ytTrack.description}&imageUrl=${ytTrack.images[0]}&publish_date=${ytTrack.publish_date}`,
        // );
      });
    } else {
      if (savedTrack.storage && deviceAlbumsById?.['All']?.allIds.includes(id)) {
        console.log('file found on device');
        dispatch(
          setMediaTrack({
            youtubeId: savedTrack.youtube[0].youtubeId,
            image,
            spotifyId: id,
            description: savedTrack.youtube[0].description,
            title,
            artists,
            publish_date: savedTrack.youtube[0].publish_date,
            file: savedTrack.storage.name,
            source,
            sourceId,
          }),
        );

        // return router.push(
        //   `/track?id=${id}&title=${title}&artists=${artists}&ytTrack=${savedTrack.youtube[0].youtubeId}&description=${savedTrack.youtube[0].description}&imageUrl=${savedTrack.youtube[0].images[0]}&publish_date=${savedTrack.youtube[0].publish_date}&file=${savedTrack.storage.name}`,
        // );
      } else {
        console.log('file not found on device');
        dispatch(
          setMediaTrack({
            youtubeId: savedTrack.youtube[0].youtubeId,
            image,
            spotifyId: id,
            description: savedTrack.youtube[0].description,
            title,
            artists,
            publish_date: savedTrack.youtube[0].publish_date,
            source,
            sourceId,
          }),
        );
      }
      // return router.push(
      //   `/track?id=${id}&title=${title}&artists=${artists}&ytTrack=${savedTrack.youtube[0].youtubeId}&description=${savedTrack.youtube[0].description}&imageUrl=${savedTrack.youtube[0].images[0]}&publish_date=${savedTrack.youtube[0].publish_date}`,
      // );
    }
  };
  const onArtistClick = async (id: string) => {
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
    router.push('/collectionList');
  };
  const onCookieClick = () => {
    router.push('/yt-login');
  };
  const onDownloadClick = () => {
    router.push('/download');
  };
  const onGoogleDriveClick = () => {
    router.push('/google-drive-tracks');
  };
  const onToggleCollection = async (
    spotifyId: string,
    collectionId: string,
    value: boolean,
  ) => {
    return await toggleTrackCollection(spotifyId, collectionId, value).then(result => {
      dispatch(toggleCollection({ spotifyId, collectionId, value }));
      // return !value && removeDeviceTrack(trackById[spotifyId], [collectionId]);
    });
  };
  const syncDeviceTracks = async () =>
    checkDeviceTracks(Object.values(collectionById)).then(data =>
      dispatch(setDeviceTracks(data)),
    );

  const onDeleteGoogleDriveTrack = async (id: string) =>
    removeGoogleDriveTrack(id).then(() => dispatch(deleteGoogleDriveTrack(id)));

  const onEditCollection = async (collectionId: string, newCollectionId: string) => {
    return await putCollection(collectionId, newCollectionId).then(result =>
      dispatch(editCollection({ collectionId, newCollectionId })),
    );
  };

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
    onDeleteGoogleDriveTrack,
    onGoogleDriveClick,
    onEditCollection,
  };
};

export default useApi;
