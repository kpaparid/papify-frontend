import Fuse from 'fuse.js';
import { DataStateType } from './redux/dataReducer';
import { AlbumTracksType } from '@/types/album-type';
import { SearchTrackType } from '@/types/search-types';
import { ArtistProfileTracksType } from '@/types/artist-type';
import { PlaylistTracksType } from '@/types/playlist-type';
import { TracksCollectionType } from '@/types/collection-type';

export const searchArray = (input, list, keys, threshold = 0.8, distance = 100) => {
  const options = {
    keys,
    threshold,
    location: 0,
    distance,
    includeMatches: true,
    includeScore: true,
    useExtendedSearch: true,
    shouldSort: true,
  };

  const fuse = new Fuse(list, options);
  const searchResult = fuse.search(input);
  return searchResult;
};
export function formatDuration(durationInMilliseconds) {
  const minutes = Math.floor(durationInMilliseconds / 60000);
  const seconds = ((durationInMilliseconds % 60000) / 1000).toFixed(0);

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
export function msToMinutesSeconds(msDuration) {
  const totalSeconds = Math.floor(msDuration / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${formattedSeconds}`;
}
export const getImageColors = async imageUri => {
  try {
    const result = await ImageColors.getColors(imageUri, {
      fallback: '#228B22',
      cache: true,
      key: imageUri,
    });

    if (result.platform === 'android' || result.platform === 'ios') {
      // Use vibrant color as accent, or dominant if vibrant is not available
      return result.vibrant || result.dominant || '#228B22';
    }

    // Fallback color
    return '#228B22';
  } catch (error) {
    console.error('Error extracting colors:', error);
    return '#228B22';
  }
};
const sanitizeFilename = (query: string) => {
  // Define invalid characters based on common filesystem restrictions
  const invalidChars = /[\/\\:*?"<>|']/g;

  // Replace invalid characters with an underscore (_)
  let sanitized = query.replace(invalidChars, '_');

  // Replace multiple underscores with a single underscore
  sanitized = sanitized.replace(/_+/g, '_');

  // Trim underscores at the start or end of the filename
  sanitized = sanitized.replace(/^_+|_+$/g, '');

  // Limit length to 255 characters (common filesystem limit)
  if (sanitized.length > 255) {
    const extensionIndex = sanitized.lastIndexOf('.');
    if (extensionIndex > 0) {
      const name = sanitized.substring(0, extensionIndex);
      const extension = sanitized.substring(extensionIndex);
      sanitized = name.substring(0, 251) + extension.substring(0, 4); // Reserve space for extension
    } else {
      sanitized = sanitized.substring(0, 255);
    }
  }
  return query;
};
export const trackToFileName = (trackQuery: string) => {
  const query = trackQuery
    .replaceAll(' - ', '--')
    .replaceAll(', ', '-')
    .replaceAll(' ', '_')
    .replaceAll("'", '');
  const sanitizedQuery = sanitizeFilename(query);
  return sanitizedQuery + '.mp3';
};
type DownloadTask<T> = () => Promise<T>;
export async function batchDownload<T>(
  tasks: DownloadTask<T>[],
  batchSize: number,
): Promise<T[]> {
  const results: T[] = []; // Array to store the results

  // Helper function to process a batch of tasks
  async function processBatch(batch: DownloadTask<T>[]): Promise<void> {
    const batchResults = await Promise.all(batch.map(task => task()));
    results.push(...batchResults);
  }

  // Iterate through tasks in batches
  for (let i = 0; i < tasks.length; i += batchSize) {
    // console.log('processing batch', i + 1, 'of', tasks.length);
    const batch = tasks.slice(i, i + batchSize); // Create a batch
    try {
      await processBatch(batch); // Process the current batch
    } catch {
      console.log('batch failed');
    }
    console.log('finished batch', i + 1, 'of', tasks.length);
  }
  console.log('finished downloading');
  return results; // Return the accumulated results
}

export const getNextAndPrevTracks = (
  tracks: (
    | SearchTrackType
    | AlbumTracksType
    | ArtistProfileTracksType
    | PlaylistTracksType
    | TracksCollectionType
  )[],
  trackIndex: number,
  state: DataStateType,
  sourceId: string,
) => {
  let nextTrackIndex = trackIndex + 1;

  if (state.mediaPlayer.shuffle) {
    const unplayedTracks = tracks.filter(
      ({ id }) => !state.mediaPlayer.playedTracks.includes(id),
    );
    if (unplayedTracks.length) {
      const randomIndex = Math.floor(Math.random() * unplayedTracks.length);
      nextTrackIndex = tracks.indexOf(unplayedTracks[randomIndex]);
    }
  }
  console.log(tracks.length, nextTrackIndex, tracks[nextTrackIndex].name);

  return {
    nextTrack: tracks[nextTrackIndex]
      ? {
          spotifyId: tracks[nextTrackIndex].id,
          title: tracks[nextTrackIndex].name,
          artists: tracks[nextTrackIndex].artists.map(({ name }) => name),
          image:
          state.albums.byId?.[sourceId]?.images[0] || 
            tracks[nextTrackIndex]?.album?.[0]?.images?.[0] ||
            tracks[nextTrackIndex]?.album?.images?.[0] ||
            tracks[nextTrackIndex]?.images?.[0],
        }
      : null,
    prevTrack: tracks[trackIndex - 1]
      ? {
          spotifyId: tracks[trackIndex - 1].id,
          title: tracks[trackIndex - 1].name,
          artists: tracks[trackIndex - 1].artists.map(({ name }) => name),
          image:
          state.albums.byId?.[sourceId]?.images[0] || 
            tracks[trackIndex - 1]?.album?.[0]?.images?.[0] ||
            tracks[trackIndex - 1]?.album?.images?.[0] ||
            tracks[trackIndex - 1]?.images?.[0],
        }
      : null,
  };
};

export const getTracksBySource = (
  state: DataStateType,
  source: 'search' | 'album' | 'artist' | 'playlist' | 'collection',
  sourceId: string,
) => {
  switch (source) {
    case 'search':
      return state.search.byId[sourceId]?.tracks || [];
    case 'album':
      return state.albums.byId[sourceId]?.tracks || [];
    case 'artist':
      return state.artists.byId[sourceId]?.tracks || [];
    case 'playlist':
      return state.playlists.byId[sourceId]?.tracks || [];
    case 'collection':
      return state.collection.byId[sourceId]?.tracks || [];
    default:
      return [];
  }
};
