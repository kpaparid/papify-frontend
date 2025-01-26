// features/counterSlice.ts
import { AlbumType } from '@/types/album-type';
import { ArtistProfileType } from '@/types/artist-type';
import CollectionTracksType from '@/types/collection-tracks-type';
import { CollectionType } from '@/types/collection-type';
import { PlaylistType } from '@/types/playlist-type';
import { SavedTrackType } from '@/types/saved-track-type';
import { SearchResultType } from '@/types/search-types';
import { YtTrackType } from '@/types/ytTrack-type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { trackToFileName } from '../helpers';
import { DeviceAlbumType } from '@/types/device-album-type';

// Define a type for the slice state
export interface DataStateType {
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
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
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
    },
    addYtTrack: (state, action: PayloadAction<YtTrackType[]>) => {
      const ytTracks = action.payload;
      ytTracks.forEach(ytTrack => {
        state.ytTracks.byId[ytTrack.spotifyId] = ytTrack;
        if (!state.ytTracks.ids.includes(ytTrack.spotifyId)) {
          state.ytTracks.ids.push(ytTrack.spotifyId);
        }
      });
    },
    setCollections: (state, action: PayloadAction<CollectionType[]>) => {
      const collection = action.payload;
      const ids = collection.map(({ name }: { name: string }) => name);
      const byId = collection.reduce((acc: { [key: string]: CollectionType }, collection: CollectionType) => {
        acc[collection.name] = collection;
        return acc;
      }, {});
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
    removeCollection: (state, action: PayloadAction<CollectionType[]>) => {
      const collections = action.payload;
      console.log({ collections });
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
        state.collection.byId[collectionId].tracks = state.collection.byId[collectionId].tracks.filter(
          item => item.id !== trackId,
        );
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
        });
        state.collection.byId['Uncategorized'].tracks = state.collection.byId['Uncategorized'].tracks.filter(
          track => track.id !== spotifyId,
        );
      } else {
        track.collectionIds = track.collectionIds.filter(id => id !== collectionId);
        state.collection.byId[collectionId].tracks = state.collection.byId[collectionId].tracks.filter(
          track => track.id !== spotifyId,
        );
        state.collection.byId['Uncategorized'].tracks.push({
          id: spotifyId,
          name: track.spotify.name,
          artists: track.spotify.artists,
          query: track.youtube[0].query,
        });
      }
    },
    setDeviceTracks: (state, action: PayloadAction<DeviceAlbumType[]>) => {
      console.log('Payload ', action.payload);
      state.deviceAlbums.ids = action.payload.map(album => album.name);
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
  },
});

export const {
  addAlbum,
  addArtist,
  addPlaylist,
  addSearchResult,
  addYtTrack,
  setCollections,
  addCollection,
  removeCollection,
  addSavedTrack,
  removeSavedTrack,
  setCollectionTracks,
  toggleCollection,
  setDeviceTracks,
  addDeviceTrack,
  removeDeviceTrack,
} = dataSlice.actions;
const dataReducer = dataSlice.reducer;
export default dataReducer;
