import Fuse from 'fuse.js';

export const searchArray = (
  input,
  list,
  keys,
  threshold = 0.8,
  distance = 100,
) => {
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
