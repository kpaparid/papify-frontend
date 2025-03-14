// features/counterSlice.ts
import { AlbumType } from '@/types/album-type';
import { ArtistProfileType } from '@/types/artist-type';
import CollectionTracksType from '@/types/collection-tracks-type';
import { CollectionType } from '@/types/collection-type';
import { DeviceAlbumType } from '@/types/device-album-type';
import { GoogleDriveTrack } from '@/types/google-drive-track-type';
import { MediaTrackType } from '@/types/media-track-type';
import { PlaylistType } from '@/types/playlist-type';
import { SavedTrackType } from '@/types/saved-track-type';
import { SearchResultType } from '@/types/search-types';
import { YtTrackType } from '@/types/ytTrack-type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ImageSourcePropType } from 'react-native';
import { getNextAndPrevTracks, getTracksBySource } from '../helpers';

// Define a type for the slice state
export interface DataStateType {
  googleDriveTracks: {
    byId: { [id: string]: GoogleDriveTrack };
    ids: string[];
    loaded: boolean;
  };
  albums: { byId: { [id: string]: AlbumType }; ids: string[]; loaded: boolean };
  artists: {
    byId: { [id: string]: ArtistProfileType };
    ids: string[];
    loaded: boolean;
  };
  playlists: {
    byId: { [id: string]: PlaylistType };
    ids: string[];
    loaded: boolean;
  };
  tracks: {
    byId: { [id: string]: SavedTrackType };
    ids: string[];
    loaded: boolean;
  };
  search: {
    byId: { [id: string]: SearchResultType };
    ids: string[];
    loaded: boolean;
  };
  ytTracks: {
    byId: { [id: string]: YtTrackType };
    ids: string[];
    loaded: boolean;
  };
  collection: {
    byId: { [id: string]: CollectionType };
    ids: string[];
    loaded: boolean;
  };
  deviceAlbums: {
    byId: { [id: string]: DeviceAlbumType };
    ids: string[];
  };
  image: {
    url?: string | ImageSourcePropType;
    loaded: boolean;
  };
  mediaTrack: {
    track: Partial<MediaTrackType> | null;
    loading: boolean;
  };
  mediaPlayer: {
    totalDuration: number;
    currentTime: number;
    playing: boolean;
    error: boolean;
    loading: boolean;
    state?: string;
    fullscreen?: boolean;
    repeat: boolean;
    autoPlay: boolean;
    shuffle: boolean;
    playedTracks: string[];
  };
}

// Define the initial state using that type
const initialState: DataStateType = {
  albums: { byId: {}, ids: [], loaded: false },
  artists: { byId: {}, ids: [], loaded: false },
  playlists: { byId: {}, ids: [], loaded: false },
  tracks: { byId: {}, ids: [], loaded: false },
  search: { byId: {}, ids: [], loaded: false },
  ytTracks: { byId: {}, ids: [], loaded: false },
  collection: { byId: {}, ids: [], loaded: false },
  deviceAlbums: { byId: {}, ids: [] },
  image: { loaded: false },
  googleDriveTracks: { byId: {}, ids: [], loaded: false },
  mediaTrack: { track: null, loading: false },
  mediaPlayer: {
    totalDuration: 0,
    currentTime: 0,
    playing: false,
    error: false,
    loading: false,
    fullscreen: false,
    repeat: false,
    shuffle: false,
    autoPlay: false,
    playedTracks: [],
  },
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setMediaPlayer: (
      state,
      action: PayloadAction<{
        currentTime?: number;
        totalDuration?: number;
        playing?: boolean;
        error?: boolean;
        loading?: boolean;
        state?: string;
        repeat?: boolean;
        autoPlay?: boolean;
        shuffle?: boolean;
        fullscreen?: boolean;
        playedTracks?: string[];
      }>,
    ) => {
      if (action.payload.currentTime !== undefined) {
        state.mediaPlayer.currentTime = action.payload.currentTime;
      }
      if (action.payload.totalDuration !== undefined) {
        state.mediaPlayer.totalDuration = action.payload.totalDuration;
      }
      if (action.payload.playing !== undefined) {
        state.mediaPlayer.playing = action.payload.playing;
      }
      if (action.payload.error !== undefined) {
        state.mediaPlayer.error = action.payload.error;
      }
      if (action.payload.loading !== undefined) {
        state.mediaPlayer.loading = action.payload.loading;
      }
      if (action.payload.state !== undefined) {
        state.mediaPlayer.state = action.payload.state;
      }
      if (action.payload.fullscreen !== undefined) {
        state.mediaPlayer.fullscreen = action.payload.fullscreen;
      }
      if (action.payload.repeat !== undefined) {
        state.mediaPlayer.repeat = action.payload.repeat;
      }
      if (action.payload.shuffle !== undefined) {
        state.mediaPlayer.shuffle = action.payload.shuffle;
      }
      if (action.payload.autoPlay !== undefined) {
        state.mediaPlayer.autoPlay = action.payload.autoPlay;
      }
      if (action.payload.playedTracks !== undefined) {
        state.mediaPlayer.playedTracks = action.payload.playedTracks;
      }
    },
    togglePlayedTrack(state, action: PayloadAction<string>) {
      if (state.mediaPlayer.playedTracks.includes(action.payload)) {
        state.mediaPlayer.playedTracks = state.mediaPlayer.playedTracks.filter(
          id => id !== action.payload,
        );
      } else {
        state.mediaPlayer.playedTracks.push(action.payload);
      }
    },
    setMediaTrackLoading: (
      state,
      action: {
        payload: {
          spotifyId: string;
          title: string;
          artists: string[];
          image: ImageSourcePropType;
          source: 'artist' | 'album' | 'playlist' | 'search' | 'collection';
          sourceId: string;
        };
      },
    ) => {
      const { spotifyId, title, artists, image, source, sourceId } = action.payload;
      const tracks = getTracksBySource(state, source, sourceId);
      const trackIndex = tracks.findIndex(({ id }) => id === spotifyId);

      if (trackIndex === -1) return;

      const { nextTrack, prevTrack } = getNextAndPrevTracks(
        tracks,
        trackIndex,
        state,
        sourceId,
      );

      state.mediaTrack.loading = true;
      state.mediaTrack.track = {
        spotifyId,
        title,
        artists,
        image,
        source,
        sourceId,
      };
      if (nextTrack) state.mediaTrack.track.nextTrack = nextTrack;
      if (prevTrack) state.mediaTrack.track.prevTrack = prevTrack;
    },
    setMediaTrack: (state, action: PayloadAction<MediaTrackType>) => {
      const { source, sourceId, spotifyId, ...rest } = action.payload;
      state.mediaTrack.track = { ...rest, spotifyId, source, sourceId };
      state.mediaTrack.loading = false;

      const tracks = getTracksBySource(state, source, sourceId);
      const trackIndex = tracks.findIndex(({ id }) => id === spotifyId);

      if (trackIndex === -1) return;
      const { nextTrack, prevTrack } = getNextAndPrevTracks(
        tracks,
        trackIndex,
        state,
        sourceId,
      );
      if (prevTrack) state.mediaTrack.track.prevTrack = prevTrack;
      if (nextTrack) state.mediaTrack.track.nextTrack = nextTrack;
    },
    setMediaTrackLoading2: (
      state,
      action: {
        payload: {
          spotifyId: string;
          title: string;
          artists: string[];
          image: ImageSourcePropType;
          source: 'artist' | 'album' | 'playlist' | 'search' | 'collection';
          sourceId: string;
        };
      },
    ) => {
      const { spotifyId, title, artists, image, source, sourceId } = action.payload;
      let prevTrack, nextTrack;
      if (source === 'search') {
        const tracks = state.search.byId[sourceId].tracks;
        const trackIndex = tracks.findIndex(({ id }) => id === spotifyId);
        let nextTrackIndex = trackIndex + 1;
        if (state.mediaPlayer.shuffle) {
          const unplayedTracks = tracks.filter(
            ({ id }) => !state.mediaPlayer.playedTracks.includes(id),
          );
          const randomIndex =
            Math.floor(Math.random() * unplayedTracks.length) +
            (trackIndex >= unplayedTracks.length ? 0 : 1);
          nextTrackIndex = tracks.indexOf(unplayedTracks[randomIndex]);
        }

        const nTrack = tracks?.[nextTrackIndex];
        const pTrack = tracks?.[trackIndex - 1];
        if (nTrack) {
          nextTrack = {
            spotifyId: nTrack.id,
            title: nTrack.name,
            artists: nTrack.artists.map(({ name }) => name),
            image: nTrack.album.images[0],
          };
        }
        if (pTrack) {
          prevTrack = {
            spotifyId: pTrack.id,
            title: pTrack.name,
            artists: pTrack.artists.map(({ name }) => name),
            image: pTrack.album.images[0],
          };
        }
      } else if (source === 'album') {
        const tracks = state.albums.byId[sourceId].tracks;
        const trackIndex = tracks.findIndex(({ id }) => id === spotifyId);
        let nextTrackIndex = trackIndex + 1;
        if (state.mediaPlayer.shuffle) {
          const unplayedTracks = tracks.filter(
            ({ id }) => !state.mediaPlayer.playedTracks.includes(id),
          );
          const randomIndex =
            Math.floor(Math.random() * unplayedTracks.length) +
            (trackIndex >= unplayedTracks.length ? 0 : 1);
          nextTrackIndex = tracks.indexOf(unplayedTracks[randomIndex]);
        }

        const nTrack = tracks?.[nextTrackIndex];
        const pTrack = tracks?.[trackIndex - 1];
        if (nTrack) {
          nextTrack = {
            spotifyId: nTrack.id,
            title: nTrack.name,
            artists: nTrack.artists.map(({ name }) => name),
            image: state.albums.byId[sourceId].images[0],
          };
        }
        if (pTrack) {
          prevTrack = {
            spotifyId: pTrack.id,
            title: pTrack.name,
            artists: pTrack.artists.map(({ name }) => name),
            image: state.albums.byId[sourceId].images[0],
          };
        }
      } else if (source === 'artist') {
        const tracks = state.artists.byId[sourceId].tracks;
        const trackIndex = tracks.findIndex(({ id }) => id === spotifyId);
        let nextTrackIndex = trackIndex + 1;
        if (state.mediaPlayer.shuffle) {
          const unplayedTracks = tracks.filter(
            ({ id }) => !state.mediaPlayer.playedTracks.includes(id),
          );
          const randomIndex =
            Math.floor(Math.random() * unplayedTracks.length) +
            (trackIndex >= unplayedTracks.length ? 0 : 1);
          nextTrackIndex = tracks.indexOf(unplayedTracks[randomIndex]);
        }

        const nTrack = tracks?.[nextTrackIndex];
        const pTrack = tracks?.[trackIndex - 1];
        if (nTrack) {
          nextTrack = {
            spotifyId: nTrack.id,
            title: nTrack.name,
            artists: nTrack.artists.map(({ name }) => name),
            image: nTrack.album[0].images[0],
          };
        }
        if (pTrack) {
          prevTrack = {
            spotifyId: pTrack.id,
            title: pTrack.name,
            artists: pTrack.artists.map(({ name }) => name),
            image: pTrack.album[0].images[0],
          };
        }
      } else if (source === 'playlist') {
        const tracks = state.playlists.byId[sourceId].tracks;
        const trackIndex = tracks.findIndex(({ id }) => id === spotifyId);
        let nextTrackIndex = trackIndex + 1;
        if (state.mediaPlayer.shuffle) {
          const unplayedTracks = tracks.filter(
            ({ id }) => !state.mediaPlayer.playedTracks.includes(id),
          );
          const randomIndex =
            Math.floor(Math.random() * unplayedTracks.length) +
            (trackIndex >= unplayedTracks.length ? 0 : 1);
          nextTrackIndex = tracks.indexOf(unplayedTracks[randomIndex]);
        }

        const nTrack = tracks?.[nextTrackIndex];
        const pTrack = tracks?.[trackIndex - 1];
        if (nTrack) {
          nextTrack = {
            spotifyId: nTrack.id,
            title: nTrack.name,
            artists: nTrack.artists.map(({ name }) => name),
            image: nTrack.album[0].images[0],
          };
        }
        if (pTrack) {
          prevTrack = {
            spotifyId: pTrack.id,
            title: pTrack.name,
            artists: pTrack.artists.map(({ name }) => name),
            image: pTrack.album[0].images[0],
          };
        }
      } else if (source === 'collection') {
        const tracks = state.collection.byId[sourceId].tracks;
        const trackIndex = tracks.findIndex(({ id }) => id === spotifyId);
        let nextTrackIndex = trackIndex + 1;
        if (state.mediaPlayer.shuffle) {
          const unplayedTracks = tracks.filter(
            ({ id }) => !state.mediaPlayer.playedTracks.includes(id),
          );
          const randomIndex =
            Math.floor(Math.random() * unplayedTracks.length) +
            (trackIndex >= unplayedTracks.length ? 0 : 1);
          nextTrackIndex = tracks.indexOf(unplayedTracks[randomIndex]);
        }

        const nTrack = tracks?.[nextTrackIndex];
        const pTrack = tracks?.[trackIndex - 1];
        if (nTrack) {
          nextTrack = {
            spotifyId: nTrack.id,
            title: nTrack.name,
            artists: nTrack.artists.map(({ name }) => name),
            image: nTrack.images[0],
          };
        }
        if (pTrack) {
          prevTrack = {
            spotifyId: pTrack.id,
            title: pTrack.name,
            artists: pTrack.artists.map(({ name }) => name),
            image: pTrack.images[0],
          };
        }
      }
      state.mediaTrack.loading = true;
      state.mediaTrack.track = {
        spotifyId,
        title,
        artists,
        image,
        source,
        sourceId,
        nextTrack,
        prevTrack,
      };
    },
    setMediaTrack2: (state, action: PayloadAction<MediaTrackType>) => {
      const { source, sourceId, spotifyId, ...rest } = action.payload;

      state.mediaTrack.track = { ...rest, spotifyId, source, sourceId };
      state.mediaTrack.loading = false;

      let prevTrack, nextTrack;
      if (source === 'search') {
        const tracks = state.search.byId[sourceId].tracks;
        const trackIndex = tracks.findIndex(({ id }) => id === spotifyId);

        let nextTrackIndex = trackIndex + 1;
        if (state.mediaPlayer.shuffle) {
          const unplayedTracks = tracks.filter(
            ({ id }) => !state.mediaPlayer.playedTracks.includes(id),
          );
          const randomIndex =
            Math.floor(Math.random() * unplayedTracks.length) +
            (trackIndex >= unplayedTracks.length ? 0 : 1);
          nextTrackIndex = tracks.indexOf(unplayedTracks[randomIndex]);
        }

        const nTrack = tracks?.[nextTrackIndex];
        const pTrack = tracks?.[trackIndex - 1];
        if (nTrack) {
          nextTrack = {
            spotifyId: nTrack.id,
            title: nTrack.name,
            artists: nTrack.artists.map(({ name }) => name),
            image: nTrack.album.images[0],
          };
        }
        if (pTrack) {
          prevTrack = {
            spotifyId: pTrack.id,
            title: pTrack.name,
            artists: pTrack.artists.map(({ name }) => name),
            image: pTrack.album.images[0],
          };
        }
      } else if (source === 'album') {
        const tracks = state.albums.byId[sourceId].tracks;
        const trackIndex = tracks.findIndex(({ id }) => id === spotifyId);
        let nextTrackIndex = trackIndex + 1;
        if (state.mediaPlayer.shuffle) {
          const unplayedTracks = tracks.filter(
            ({ id }) => !state.mediaPlayer.playedTracks.includes(id),
          );
          const randomIndex =
            Math.floor(Math.random() * unplayedTracks.length) +
            (trackIndex >= unplayedTracks.length ? 0 : 1);
          nextTrackIndex = tracks.indexOf(unplayedTracks[randomIndex]);
        }

        const nTrack = tracks?.[nextTrackIndex];
        const pTrack = tracks?.[trackIndex - 1];
        if (nTrack) {
          nextTrack = {
            spotifyId: nTrack.id,
            title: nTrack.name,
            artists: nTrack.artists.map(({ name }) => name),
            image: state.albums.byId[sourceId].images[0],
          };
        }
        if (pTrack) {
          prevTrack = {
            spotifyId: pTrack.id,
            title: pTrack.name,
            artists: pTrack.artists.map(({ name }) => name),
            image: state.albums.byId[sourceId].images[0],
          };
        }
      } else if (source === 'artist') {
        const tracks = state.artists.byId[sourceId].tracks;
        const trackIndex = tracks.findIndex(({ id }) => id === spotifyId);
        let nextTrackIndex = trackIndex + 1;
        if (state.mediaPlayer.shuffle) {
          const unplayedTracks = tracks.filter(
            ({ id }) => !state.mediaPlayer.playedTracks.includes(id),
          );
          const randomIndex =
            Math.floor(Math.random() * unplayedTracks.length) +
            (trackIndex >= unplayedTracks.length ? 0 : 1);
          nextTrackIndex = tracks.indexOf(unplayedTracks[randomIndex]);
        }

        const nTrack = tracks?.[nextTrackIndex];
        const pTrack = tracks?.[trackIndex - 1];
        if (nTrack) {
          nextTrack = {
            spotifyId: nTrack.id,
            title: nTrack.name,
            artists: nTrack.artists.map(({ name }) => name),
            image: nTrack.album[0].images[0],
          };
        }
        if (pTrack) {
          prevTrack = {
            spotifyId: pTrack.id,
            title: pTrack.name,
            artists: pTrack.artists.map(({ name }) => name),
            image: pTrack.album[0].images[0],
          };
        }
      } else if (source === 'playlist') {
        const tracks = state.playlists.byId[sourceId].tracks;
        const trackIndex = tracks.findIndex(({ id }) => id === spotifyId);
        let nextTrackIndex = trackIndex + 1;
        if (state.mediaPlayer.shuffle) {
          const unplayedTracks = tracks.filter(
            ({ id }) => !state.mediaPlayer.playedTracks.includes(id),
          );
          const randomIndex =
            Math.floor(Math.random() * unplayedTracks.length) +
            (trackIndex >= unplayedTracks.length ? 0 : 1);
          nextTrackIndex = tracks.indexOf(unplayedTracks[randomIndex]);
        }

        const nTrack = tracks?.[nextTrackIndex];
        const pTrack = tracks?.[trackIndex - 1];
        if (nTrack) {
          nextTrack = {
            spotifyId: nTrack.id,
            title: nTrack.name,
            artists: nTrack.artists.map(({ name }) => name),
            image: nTrack.album[0].images[0],
          };
        }
        if (pTrack) {
          prevTrack = {
            spotifyId: pTrack.id,
            title: pTrack.name,
            artists: pTrack.artists.map(({ name }) => name),
            image: pTrack.album[0].images[0],
          };
        }
      } else if (source === 'collection') {
        const tracks = state.collection.byId[sourceId].tracks;
        const trackIndex = tracks.findIndex(({ id }) => id === spotifyId);
        let nextTrackIndex = trackIndex + 1;
        if (state.mediaPlayer.shuffle) {
          const unplayedTracks = tracks.filter(
            ({ id }) => !state.mediaPlayer.playedTracks.includes(id),
          );
          const randomIndex =
            Math.floor(Math.random() * unplayedTracks.length) +
            (trackIndex >= unplayedTracks.length ? 0 : 1);
          nextTrackIndex = tracks.indexOf(unplayedTracks[randomIndex]);
        }

        const nTrack = tracks?.[nextTrackIndex];
        const pTrack = tracks?.[trackIndex - 1];
        if (nTrack) {
          nextTrack = {
            spotifyId: nTrack.id,
            title: nTrack.name,
            artists: nTrack.artists.map(({ name }) => name),
            image: nTrack.images[0],
          };
        }
        if (pTrack) {
          prevTrack = {
            spotifyId: pTrack.id,
            title: pTrack.name,
            artists: pTrack.artists.map(({ name }) => name),
            image: pTrack.images[0],
          };
        }
      }

      state.mediaTrack.track.prevTrack = prevTrack;
      state.mediaTrack.track.nextTrack = nextTrack;
    },
    removeMediaTrack: state => {
      state.mediaTrack.track = null;
      state.mediaTrack.loading = false;
    },
    setGoogleDriveTracks: (state, action: PayloadAction<GoogleDriveTrack[]>) => {
      const googleDriveTracksArray = action.payload;
      const googleDriveTracksById = googleDriveTracksArray.reduce(
        (acc, track) => {
          acc[track.id] = track;
          return acc;
        },
        {} as { [id: string]: GoogleDriveTrack },
      );
      state.googleDriveTracks.byId = googleDriveTracksById;
      state.googleDriveTracks.ids = googleDriveTracksArray.map(track => track.id);
      state.googleDriveTracks.loaded = true;
    },
    setImage: (state, action: PayloadAction<string | ImageSourcePropType>) => {
      state.image.url = action.payload;
      state.image.loaded = true;
    },
    addAlbum: (state, action: PayloadAction<AlbumType>) => {
      const album = action.payload;
      state.albums.byId[album.id] = album;
      if (!state.albums.ids.includes(album.id)) {
        state.albums.ids.push(album.id);
      }
      state.albums.loaded = true;
    },
    addArtist: (state, action: PayloadAction<ArtistProfileType>) => {
      const artist = action.payload;
      state.artists.byId[artist.id] = artist;
      if (!state.artists.ids.includes(artist.id)) {
        state.artists.ids.push(artist.id);
      }
      state.artists.loaded = true;
    },
    addPlaylist: (state, action: PayloadAction<PlaylistType>) => {
      const playlist = action.payload;
      state.playlists.byId[playlist.id] = playlist;
      if (!state.playlists.ids.includes(playlist.id)) {
        state.playlists.ids.push(playlist.id);
      }
      state.playlists.loaded = true;
    },
    addSearchResult: (state, action: PayloadAction<SearchResultType>) => {
      const searchResult = action.payload;
      state.search.byId[searchResult.id] = searchResult;
      if (!state.search.ids.includes(searchResult.id)) {
        state.search.ids.push(searchResult.id);
      }
      state.search.loaded = true;
      state.image.loaded = true;
      state.image.url =
        searchResult.topResult.images?.[0] || searchResult.topResult.album?.images?.[0];
    },
    addYtTrack: (state, action: PayloadAction<YtTrackType>) => {
      const ytTrack = action.payload;
      state.ytTracks.byId[ytTrack.spotifyId] = ytTrack;
      if (!state.ytTracks.ids.includes(ytTrack.spotifyId)) {
        state.ytTracks.ids.push(ytTrack.spotifyId);
      }
    },
    setCollections: (state, action: PayloadAction<CollectionType[]>) => {
      const collection = action.payload;
      const ids = collection.map(({ name }: { name: string }) => name);
      const byId = collection.reduce(
        (acc: { [key: string]: CollectionType }, collection: CollectionType) => {
          acc[collection.name] = collection;
          return acc;
        },
        {},
      );
      state.collection.byId = byId;
      state.collection.ids = ids;
      state.collection.loaded = true;
    },
    addCollection: (state, action: PayloadAction<CollectionType[]>) => {
      const collections = action.payload;
      state.collection.ids = collections.map(collection => collection.name);
      state.collection.byId = collections.reduce(
        (acc: { [key: string]: CollectionType }, collection: CollectionType) => {
          acc[collection.name] = collection;
          return acc;
        },
        {},
      );
      state.collection.loaded = true;
    },
    editCollection: (
      state,
      action: PayloadAction<{ collectionId: string; newCollectionId: string }>,
    ) => {
      const { collectionId, newCollectionId } = action.payload;
      state.collection.ids = state.collection.ids.map(id =>
        id === collectionId ? newCollectionId : id,
      );
      state.collection.byId[newCollectionId] = {
        ...state.collection.byId[collectionId],
        name: newCollectionId,
      };
      delete state.collection.byId[collectionId];
    },
    removeCollection: (state, action: PayloadAction<CollectionType[]>) => {
      const collections = action.payload;
      state.collection.ids = collections.map(collection => collection.name);
      state.collection.byId = collections.reduce(
        (acc: { [key: string]: CollectionType }, collection: CollectionType) => {
          acc[collection.name] = collection;
          return acc;
        },
        {},
      );
      state.collection.loaded = true;
    },
    setTracks: (state, action: PayloadAction<SavedTrackType[]>) => {
      const tracksArray = action.payload;
      const tracksById = tracksArray.reduce(
        (acc, track) => {
          acc[track.id] = track;
          return acc;
        },
        {} as { [id: string]: SavedTrackType },
      );
      state.tracks.byId = tracksById;
      state.tracks.ids = tracksArray.map(track => track.id);
      state.tracks.loaded = true;
    },
    addSavedTrack: (state, action: PayloadAction<SavedTrackType>) => {
      const track = action.payload;
      state.tracks.byId[track.id] = track;
      if (!state.tracks.ids.includes(track.id)) {
        state.tracks.ids.push(track.id);
      }
      state.collection.loaded = false;
    },
    removeSavedTrack: (state, action: PayloadAction<string>) => {
      const trackId = action.payload;
      delete state.tracks.byId[trackId];
      state.tracks.ids = state.tracks.ids.filter(item => item !== trackId);
      state.collection.ids.forEach(collectionId => {
        state.collection.byId[collectionId].tracks = state.collection.byId[
          collectionId
        ].tracks.filter(item => item.id !== trackId);
      });
    },
    setCollectionTracks: (state, action: PayloadAction<CollectionTracksType>) => {
      const { tracks, collections } = action.payload;
      state.tracks.ids = tracks.map(track => track.id);
      state.tracks.byId = tracks.reduce(
        (acc, track) => {
          acc[track.id] = track;
          return acc;
        },
        {} as { [id: string]: SavedTrackType },
      );
      state.collection.ids = collections.map(collection => collection.name);
      state.collection.byId = collections.reduce(
        (acc: { [key: string]: CollectionType }, collection: CollectionType) => {
          acc[collection.name] = collection;
          return acc;
        },
        {},
      );
      state.collection.loaded = true;
      state.tracks.loaded = true;
    },
    toggleCollection: (
      state,
      action: PayloadAction<{
        spotifyId: string;
        collectionId: string;
        value: boolean;
      }>,
    ) => {
      const { spotifyId, collectionId, value } = action.payload;
      const track = state.tracks.byId[spotifyId];
      if (value) {
        if (!track.collectionIds.includes(collectionId)) {
          track.collectionIds.push(collectionId);
        }
        state.collection.byId[collectionId].tracks.push({
          id: spotifyId,
          name: track.spotify.name,
          artists: track.spotify.artists,
          query: track.youtube[0].query,
          images: track.spotify.album.images,
        });
        state.collection.byId['Uncategorized'].tracks = state.collection.byId[
          'Uncategorized'
        ].tracks.filter(track => track.id !== spotifyId);
      } else {
        track.collectionIds = track.collectionIds.filter(id => id !== collectionId);
        state.collection.byId[collectionId].tracks = state.collection.byId[
          collectionId
        ].tracks.filter(track => track.id !== spotifyId);
        state.collection.byId['Uncategorized'].tracks.push({
          id: spotifyId,
          name: track.spotify.name,
          artists: track.spotify.artists,
          query: track.youtube[0].query,
          images: track.spotify.album.images,
        });
      }
    },
    setDeviceTracks: (state, action: PayloadAction<DeviceAlbumType[]>) => {
      state.deviceAlbums.ids = action.payload.map(category => category.name);
      state.deviceAlbums.byId = action.payload.reduce(
        (acc, track) => {
          acc[track.name] = track;
          return acc;
        },
        {} as { [id: string]: DeviceAlbumType },
      );
    },
    addDeviceTrack: (state, action: PayloadAction<string>) => {
      const spotifyId = action.payload;
      state.deviceTracks.ids.push(spotifyId);
    },
    removeDeviceTrack: (state, action: PayloadAction<string>) => {
      const spotifyId = action.payload;
      state.deviceTracks.ids = state.deviceTracks.ids.filter(id => id !== spotifyId);
    },
    deleteGoogleDriveTrack: (state, action: PayloadAction<string>) => {
      const googleDriveTrackId = action.payload;
      state.googleDriveTracks.ids = state.googleDriveTracks.ids.filter(
        id => id !== googleDriveTrackId,
      );

      const trackToChange = Object.values(state.tracks.byId).find(
        track => track.storage?.storageId === googleDriveTrackId,
      );

      if (trackToChange) {
        state.tracks.byId[trackToChange.id].storage = undefined;
      }
    },
  },
});

export const {
  addAlbum,
  addArtist,
  addPlaylist,
  addSearchResult,
  addYtTrack,
  setCollections,
  editCollection,
  addCollection,
  removeCollection,
  addSavedTrack,
  removeSavedTrack,
  setCollectionTracks,
  toggleCollection,
  setDeviceTracks,
  addDeviceTrack,
  removeDeviceTrack,
  setImage,
  setGoogleDriveTracks,
  deleteGoogleDriveTrack,
  setMediaTrack,
  removeMediaTrack,
  setMediaTrackLoading,
  setMediaPlayer,
  togglePlayedTrack,
} = dataSlice.actions;
const dataReducer = dataSlice.reducer;
export default dataReducer;
