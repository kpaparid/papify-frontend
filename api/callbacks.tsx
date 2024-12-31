import { AlbumType } from '@/types/album-type';
import { ArtistProfileType } from '@/types/artist-type';
import CollectionTracksType from '@/types/collection-tracks-type';
import { CollectionType } from '@/types/collection-type';
import { PlaylistType } from '@/types/playlist-type';
import { SavedTrackType } from '@/types/saved-track-type';
import { SearchResultType } from '@/types/search-types';
import { YtTrackType } from '@/types/ytTrack-type';
import * as FileSystem from 'expo-file-system';

import * as MediaLibrary from 'expo-media-library';
import { Alert, PermissionsAndroid } from 'react-native';
// const BACKEND_API = process.env.BACKEND_API
// const BACKEND_API = 'http://127.0.0.1:5000/api';
const BACKEND_API = 'https://papify-backend.onrender.com/api';

const getRequest = (url: string) =>
  fetch(BACKEND_API + url).then(response => response.json());
const postRequest = (url: string, data?: any) =>
  fetch(BACKEND_API + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(response => response.json());
const deleteRequest = (url: string) =>
  fetch(BACKEND_API + url, { method: 'DELETE' }).then(response =>
    response.json(),
  );
const putRequest = (url: string, data: any) =>
  fetch(BACKEND_API + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
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
export function postCollection(
  collectionId: string,
): Promise<CollectionType[]> {
  return postRequest(`/collections/${collectionId}`);
}
export function deleteCollection(
  collectionId: string,
): Promise<CollectionType[]> {
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
): Promise<YtTrackType[]> {
  const artistsString = artists ? `&artists=${artists}` : '';
  return getRequest(
    `/youtube/tracks?id=${spotifyId}&title=${title}${artistsString}`,
  );
}
export function getCollectionTracks(): Promise<CollectionTracksType> {
  return getRequest('/collections/tracks');
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
export async function downloadTrack(track: SavedTrackType) {
  // return getRequest(`/tracks/${spotifyId}/download`)

  const fileUri = `${BACKEND_API}/tracks/${track.id}/download`; // Replace with your download URL

  // if (collectionIds) fileUri += `?ids=${collectionIds.join(',')}`

  // Download the file
  //   const filename = name + '-' + artist + '-' + spotifyId + '.mp3';
  console.log('Downloading file:', track.youtube[0].query);
  const filename =
    track.youtube[0].query.replaceAll(' ', '').replaceAll(',', '-') + '.mp3';
  const fileUriLocal = FileSystem.documentDirectory + filename;

  const callback = downloadProgress => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    // setDownloadProgress(progress)
    console.log(progress);
  };
  const downloadResumable = FileSystem.createDownloadResumable(
    fileUri,
    fileUriLocal,
    {},
    callback,
  );
  try {
    console.log('Started Download');
    const dl = await downloadResumable.downloadAsync();
    // const { uri } = await FileSystem.downloadAsync(fileUri, fileUriLocal)
    console.log('Successfully downloaded file ');
    await moveMp3(filename);
    //   await getSongs()
  } catch (error) {
    console.error('Error downloading file:', error);
    // Handle specific errors here
  }
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
    const album = await MediaLibrary.getAlbumAsync('Papify');

    if (album) {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, true);
    } else {
      await MediaLibrary.createAlbumAsync('Papify', asset, true);
    }
    Alert.alert('Success', 'File moved to external storage!');
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

    Alert.alert('Success', 'File deleted from internal storage!');
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to move the file.');
  }
};
async function moveMp32(filename: string) {
  //   const granted = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //     {
  //       title: 'Cool Photo App Camera Permission',
  //       message:
  //         'Cool Photo App needs access to your camera ' +
  //         'so you can take awesome pictures.',
  //       buttonNeutral: 'Ask Me Later',
  //       buttonNegative: 'Cancel',
  //       buttonPositive: 'OK',
  //     },
  //   );
  //   console.log('Permission granted ' + granted);
  //   const { status } = await MediaLibrary.requestPermissionsAsync();
  //   if (status !== 'granted') {
  //     console.error('Permission to access media library is not granted');
  //     return;
  //   }

  // Get files in the app's document directory
  const files = await FileSystem.readDirectoryAsync(
    FileSystem.documentDirectory + '',
  );
  const mp3File = files.find(file => file === filename);
  if (mp3File) {
    console.log('File found ' + mp3File);
    const sourceUri = FileSystem.documentDirectory + mp3File;
    console.log('Source URI ' + sourceUri);
    // Define the destination URI
    const asset = await MediaLibrary.createAssetAsync(sourceUri);
    console.log(asset);
    // await MediaLibrary.createAlbumAsync('Papify', asset, false);
    // console.log('Album created');

    // Delete the original file after moving it
    return await FileSystem.deleteAsync(sourceUri);
  }
}
