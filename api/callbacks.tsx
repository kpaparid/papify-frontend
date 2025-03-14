import MoveFileModule from '@/modules/move-file';
import { AlbumType } from '@/types/album-type';
import { ArtistProfileType } from '@/types/artist-type';
import CollectionTracksType from '@/types/collection-tracks-type';
import { CollectionType, TracksCollectionType } from '@/types/collection-type';
import { PlaylistType } from '@/types/playlist-type';
import { SavedTrackType } from '@/types/saved-track-type';
import { SearchResultType } from '@/types/search-types';
import { YtTrackType } from '@/types/ytTrack-type';
import { batchDownload } from '@/utils/helpers';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import { DeviceAlbumType } from '@/types/device-album-type';
import { Alert } from 'react-native';
import { GoogleDriveTrack } from '@/types/google-drive-track-type';
const BACKEND_API = 'https://papify-backend.onrender.com/api';
// const BACKEND_API = 'http://localhost:5000/api';

const getRequest = (url: string) =>
  fetch(BACKEND_API + url).then(response => response.json());
const postRequest = (url: string, data?: any) => {
  return fetch(BACKEND_API + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(response => {
    return response.json();
  });
};
const deleteRequest = (url: string) =>
  fetch(BACKEND_API + url, { method: 'DELETE' }).then(response => response.json());
const putRequest = (url: string, data?: any) =>
  fetch(BACKEND_API + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: data && JSON.stringify(data),
  }).then(response => response.json());

export function searchSpotify({
  query,
  type,
  offset,
  market,
  limit,
}: {
  query: string;
  type?: string;
  offset?: number;
  market?: string;
  limit?: number;
}) {
  return getRequest(
    `/spotify/search?${query ? `query=${query}` : ''}${type ? `&type=${type}` : ''}${offset ? `&offset=${offset}` : ''}${market ? `&market=${market}` : ''}${limit ? `&limit=${limit}` : ''}`,
  ) as Promise<SearchResultType>;
}
export function getSpotifyArtist(id: string) {
  return getRequest('/spotify/artist/' + id) as Promise<ArtistProfileType>;
}

export function getSpotifyAlbum(id: string) {
  return getRequest('/spotify/album/' + id) as Promise<AlbumType>;
}

export function getSpotifyPlaylist(id: string) {
  return getRequest('/spotify/playlist/' + id) as Promise<PlaylistType>;
}

export function addTrackCollection(spotifyId: string, collectionId: string) {
  return postRequest(`/tracks/${spotifyId}/collections`, { collectionId });
}
export function removeTrackCollection(spotifyId: string, collectionId: string) {
  return deleteRequest(`/tracks/${spotifyId}/collections/${collectionId}`);
}
export function getCollections(): Promise<CollectionType[]> {
  return getRequest('/collections');
}
export function postCollection(collectionId: string): Promise<CollectionType[]> {
  return postRequest(`/collections/${collectionId}`);
}
export function putCollection(
  collectionId: string,
  newCollectionId: string,
): Promise<CollectionType[]> {
  return putRequest(`/collections/${collectionId}`, { name: newCollectionId });
}
export function deleteCollection(collectionId: string): Promise<CollectionType[]> {
  return deleteRequest(`/collections/${collectionId}`);
}
export function getTracks() {
  return getRequest('/tracks');
}
export function removeTrack(trackId: string) {
  return deleteRequest(`/tracks/${trackId}`);
}
export function getYtTrack(
  spotifyId: string,
  title: string,
  artists?: string[],
): Promise<YtTrackType> {
  const artistsString = artists ? `&artists=${artists.join(', ')}` : '';
  return getRequest(`/youtube/tracks?id=${spotifyId}&title=${title}${artistsString}`);
}
export function getCollectionTracks(): Promise<CollectionTracksType> {
  return getRequest('/collections/tracks');
}
export function getGoogleDriveTracks(): Promise<GoogleDriveTrack[]> {
  return getRequest('/google-drive/tracks');
}
export function removeGoogleDriveTrack(id: string) {
  return deleteRequest('/google-drive/tracks/' + id);
}
export function deleteTrack(spotifyId: string): Promise<string> {
  return deleteRequest(`/collections/tracks/${spotifyId}`);
}
export function saveTrack(spotifyId: string): Promise<SavedTrackType> {
  return postRequest(`/tracks/${spotifyId}/save`);
}
export function toggleTrackCollection(
  spotifyId: string,
  collectionId: string,
  value: boolean,
) {
  return putRequest(`/collections/${collectionId}/tracks/${spotifyId}`, {
    value,
  });
}
export async function downloadTrack(id: string, filename: string) {
  const fileUri = `${BACKEND_API}/tracks/${id}/download`;
  const fileUriLocal = FileSystem.documentDirectory + filename;
  const fileInfo = await FileSystem.getInfoAsync(fileUriLocal);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(fileUriLocal);

    console.log('File already exists, skipping download:', filename);
  }
  const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
    const progress =
      downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    console.log(progress);
  };
  const downloadResumable = FileSystem.createDownloadResumable(
    fileUri,
    fileUriLocal,
    {},
    callback,
  );
  return downloadResumable.downloadAsync().then(() => moveMp3(filename));
}

export async function downloadTracks(tracks: { id: string; filename: string }[]) {
  console.log('started download', tracks.length);
  const data = await batchDownload(
    tracks.map(track => () => downloadTrack(track.id, track.filename)),
    1,
  );
}
const moveMp3 = async (fileName: string) => {
  const internalUri = FileSystem.documentDirectory + fileName;

  try {
    // Request permission to access media library
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Cannot access external storage.');
      return;
    }

    // Ensure the file exists
    console.log('Internal URI:', internalUri);
    const fileInfo = await FileSystem.getInfoAsync(internalUri);
    console.log('File Info:', fileInfo);

    if (!fileInfo.exists) {
      Alert.alert('File Not Found', 'The specified file does not exist.');
      return;
    }

    // Create an asset and move it to the media library
    const asset = await MediaLibrary.createAssetAsync(internalUri);
    const album = await MediaLibrary.getAlbumAsync('Papify All');

    if (album) {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, true);
    } else {
      await MediaLibrary.createAlbumAsync('Papify All', asset, true);
    }
    // Alert.alert('Success', 'File moved to external storage!');
    // **Delete the original file after moving**

    const fileInfo2 = await FileSystem.getInfoAsync(internalUri);
    console.log('File Info:', fileInfo2);

    const deleteResult = await FileSystem.deleteAsync(internalUri, {
      idempotent: true,
    });
    console.log('File deletion result:', deleteResult);
    const fileInfo3 = await FileSystem.getInfoAsync(internalUri);
    console.log('File Info:', fileInfo3);
    const deleteAsset = await MediaLibrary.deleteAssetsAsync([asset]);
    console.log('File deletion result:', deleteAsset);
    console.log('File moved to external storage', fileName);
    // Alert.alert('Success', 'File deleted from internal storage!');
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to move the file.' + fileName);
  }
};
export async function getDeviceTracks(): Promise<string[]> {
  // Request permission to access media library
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access media library denied');
    return [];
  }

  // Fetch all albums
  const papifyAlbum = await MediaLibrary.getAlbumAsync('Papify All');

  if (!papifyAlbum) {
    console.log('Album "Papify" not found');
    return [];
  }
  console.log('Papify album found: ', papifyAlbum);

  // Fetch media from the "Papify" album
  const media = await MediaLibrary.getAssetsAsync({
    album: papifyAlbum,
    mediaType: MediaLibrary.MediaType.audio,
  });

  console.log('Media fetched: ', media);

  // Add filename to each asset for reference
  const assetsWithNames = media.assets.map(({ filename }) => filename);

  return assetsWithNames;
}

export async function createDeviceAlbums(deviceAlbums: {
  byId: { [id: string]: DeviceAlbumType };
  ids: string[];
}) {
  console.log('Starting to move files...', deviceAlbums);

  // 1. Request Permissions
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permission to access media library denied.');
    return;
  }

  try {
    // 2. Check or Create Parent Album ('Papify')
    let papifyAlbum = await MediaLibrary.getAlbumAsync('Papify All');
    let media = await MediaLibrary.getAssetsAsync({
      album: papifyAlbum,
      mediaType: MediaLibrary.MediaType.audio,
    });

    if (!papifyAlbum || deviceAlbums.byId['All'].missingIds.length > 0) {
      console.log('Creating Papify album...');
      await downloadTracks(
        deviceAlbums.byId['All'].missingIds.map(trackId => ({
          id: deviceAlbums.byId['All'].byId[trackId].id,
          filename: deviceAlbums.byId['All'].byId[trackId].storage?.name,
        })),
      );
      papifyAlbum = await MediaLibrary.getAlbumAsync('Papify All');
      media = await MediaLibrary.getAssetsAsync({
        album: papifyAlbum,
        mediaType: MediaLibrary.MediaType.audio,
      });
    }
    console.log('Papify album:', papifyAlbum);

    if (!media.assets.length) {
      console.log('No audio files found in Papify album.');
      return;
    }
    console.log(Object.values(deviceAlbums.byId['All'].byId));
    // 4. Process Each Asset
    for (const asset of media.assets) {
      console.log('Processing asset:', asset.filename);

      // Find matching track
      const track = Object.values(deviceAlbums.byId['All'].byId).find(t => {
        return t.storage?.name === asset.filename;
      }) as TracksCollectionType;

      if (!track) {
        console.warn('No matching track found for:', asset.filename);
        continue; // Skip this asset if no match
      }

      console.log('Found matching track:', track.name);

      // 5. Handle Multiple Collections
      for (const collectionId of Object.values(deviceAlbums.byId)
        .filter(({ name, missingIds }) => name !== 'All' && missingIds.includes(track.id))
        .map(({ name }) => name)) {
        console.log(`Processing collection ID: ${collectionId}`);

        try {
          // 5.1 Cache collection album references
          const albumName = `Papify ${collectionId}`;
          let collectionAlbum = await MediaLibrary.getAlbumAsync(albumName);

          // 5.2 Create collection album if not exists
          if (!collectionAlbum) {
            console.log(`Creating album: ${albumName}`);
            collectionAlbum = await MediaLibrary.createAlbumAsync(
              albumName,
              asset, // Add the first asset during creation
              false,
            );
          }

          // 5.3 Fetch Media in Collection Album
          const collectionMedia = await MediaLibrary.getAssetsAsync({
            album: collectionAlbum,
            mediaType: MediaLibrary.MediaType.audio,
          });

          // 5.4 Check if the asset already exists in the collection
          const assetExists = collectionMedia.assets.some(
            ({ filename }) => filename === asset.filename,
          );

          if (assetExists) {
            console.log(`Asset already exists in album ${albumName}: ${asset.filename}`);
            continue; // Skip adding if already exists
          }

          // 5.5 Add Asset to Album
          console.log(`Adding ${asset.filename} to album: ${albumName}`);
          await MediaLibrary.addAssetsToAlbumAsync(
            [asset],
            collectionAlbum,
            true, // Don't copy the asset
          );
          console.log(`Successfully added to album: ${albumName}`);
        } catch (error) {
          console.error(
            `Error processing collection ${collectionId} for ${asset.filename}:`,
            error,
          );
        }
      }
    }

    console.log('Finished moving files.');
  } catch (error) {
    console.error('An error occurred during the file-moving process:', error);
  }
}

export async function moveFiles2() {
  try {
    // Example: Get the mount path for the USB
    const usbPath = '/storage/emulated/0/MyPapflix'; // Replace with your USB mount path

    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      console.log('Permission to access media library is required!');
      return;
    }

    // Get all albums
    const allAlbums = await MediaLibrary.getAlbumsAsync();

    // Filter albums that start with 'Papify '
    const copyAlbums = allAlbums.filter(album => album.title.startsWith('Copy_Papify '));

    for (let album of copyAlbums) {
      // Delete the album
      await MediaLibrary.deleteAlbumsAsync([album.id]);
      console.log(`Deleted album: ${album.title}`);
    }

    // Filter albums that start with 'Papify '
    const papifyAlbums = allAlbums.filter(album => album.title.startsWith('Papify '));

    // Loop through each 'Papify' album
    for (let album of papifyAlbums) {
      // Create a new album with the title 'Copy_' + album.title
      // Fetch the assets within the original album
      const albumAssets = await MediaLibrary.getAssetsAsync({
        album,
        mediaType: MediaLibrary.MediaType.audio,
        first: 100000, // Fetch all assets from the album
      });
      if (albumAssets.assets.length > 0) {
        // Create a new album with the title 'Copy_' + album.title, using the first asset to create the album
        const newAlbumTitle = `Copy_${album.title}`;
        const firstAsset = albumAssets.assets[0];
        const newAlbum = await MediaLibrary.createAlbumAsync(newAlbumTitle, firstAsset);

        // Directly add the original assets to the new album without creating duplicates
        const assetIds = albumAssets.assets.slice(1).map(asset => asset.id);

        // Add the assets to the new album
        if (assetIds.length > 0) {
          await MediaLibrary.addAssetsToAlbumAsync(assetIds, newAlbum.id);
          console.log(
            `Created copy of album: ${newAlbumTitle} with ${assetIds.length} assets.`,
          );
        }
      } else {
        console.log(`No assets found in album ${album.title}. Skipping album creation.`);
      }
    }
    MoveFileModule.moveFolders(
      usbPath,
      papifyAlbums.map(album => `/storage/emulated/0/Music/Copy_${album.title}`),
    );
  } catch (error) {
    console.log(error);
  }
}
export async function checkDeviceTracks(
  collections: CollectionType[],
): Promise<DeviceAlbumType[]> {
  // Request permission to access media library
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access media library denied');
    throw new Error('Permission to access media library denied');
  }

  const collectionsSummary = [] as DeviceAlbumType[];
  // Check each track in the collections
  const allAlbums = await MediaLibrary.getAlbumsAsync();
  const albumsToDelete = allAlbums.filter(
    album =>
      album.title.startsWith('Papify ') &&
      !collections.map(({ name }) => `Papify ${name}`).includes(album.title),
  );

  // Step 3: Extract IDs of albums to delete
  const albumIdsToDelete = albumsToDelete.map(album => album.id);

  if (albumIdsToDelete.length > 0) {
    // Step 4: Delete the albums
    await MediaLibrary.deleteAlbumsAsync(albumIdsToDelete);
    console.log(`Deleted albums: ${albumIdsToDelete}`);
  }
  // const album = await MediaLibrary.getAlbumAsync(`Papify Uncategorized`);
  // console.log({ album });
  // const media = await MediaLibrary.getAssetsAsync({
  //   album: album,
  //   mediaType: ['audio', 'photo', 'video', 'unknown'],
  // });
  // console.log({ media });
  for (const collection of collections) {
    console.log('Checking album Papify', collection.name);
    const papifyAlbum = await MediaLibrary.getAlbumAsync(`Papify ${collection.name}`);
    if (!papifyAlbum) {
      console.log(`Papify ${collection.name} not found`);
      collectionsSummary.push({
        name: collection.name,
        allIds: collection.tracks.map(track => track.id),
        missingIds: collection.tracks.map(track => track.id),
        byId: collection.tracks.reduce(
          (acc, track) => {
            acc[track.id] = track;
            return acc;
          },
          {} as { [id: string]: TracksCollectionType },
        ),
      });
    } else {
      const unknownMedia = await MediaLibrary.getAssetsAsync({
        album: papifyAlbum,
        mediaType: ['photo', 'video', 'unknown', 'audio'],
      });
      const unknownAssets = unknownMedia.assets.filter(
        asset =>
          !(
            asset.mediaType === 'audio' &&
            collection.tracks.some(track => track?.storage.name === asset.filename)
          ),
      );
      if (unknownAssets.length > 0) {
        const idsToDelete = unknownMedia.assets.map(asset => asset.id);
        await MediaLibrary.deleteAssetsAsync(idsToDelete);
        console.log(`Deleted ${idsToDelete.length} non-audio assets.`);
      } else {
        console.log('No non-audio assets found.');
      }

      const media = await MediaLibrary.getAssetsAsync({
        album: papifyAlbum,
        mediaType: MediaLibrary.MediaType.audio,
        first: 100000,
      });

      const existingTracks = new Set([...media.assets.map(({ filename }) => filename)]);
      const missingIds = [];

      for (const track of collection.tracks) {
        const trackFilename = track.storage?.name;
        if (!existingTracks.has(trackFilename)) {
          missingIds.push(track.id); // Add missing track ID
        }
      }

      // Add summary for the collection
      collectionsSummary.push({
        name: collection.name,
        allIds: collection.tracks.map(track => track.id),
        missingIds,
        byId: collection.tracks.reduce(
          (acc, track) => {
            acc[track.id] = track;
            return acc;
          },
          {} as { [id: string]: TracksCollectionType },
        ),
      });
    }

    // Fetch media from the "Papify All" album
  }

  // Output results
  console.log('Ending checkDeviceTracks');

  return collectionsSummary;
}

export async function removeDeviceTrack(track: SavedTrackType, collectionIds: string[]) {
  // Request permission to access media library
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access media library denied');
    return 0;
  }
  for (const collection of collectionIds) {
    const papifyAlbum = await MediaLibrary.getAlbumAsync(`Papify ${collection}`);
    if (!papifyAlbum) {
      console.log(`Papify ${collection} not found`);
      return 0;
    }

    // Fetch media from the "Papify All" album
    const media = await MediaLibrary.getAssetsAsync({
      album: papifyAlbum,
      mediaType: MediaLibrary.MediaType.audio,
    });

    const existingTracks = new Set([...media.assets.map(({ filename }) => filename)]);

    const trackFilename = track.storage?.name;
    if (existingTracks.has(trackFilename)) {
      const asset = media.assets.find(asset => asset.filename === trackFilename);
      if (asset) {
        await MediaLibrary.deleteAssetsAsync([asset]);
      }
    }
  }
}
export async function postCookies(cookie: string) {
  return postRequest('/yt-cookie', { cookie });
}
