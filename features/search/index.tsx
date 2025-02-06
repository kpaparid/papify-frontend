import List from '@/components/list';
import useApi from '@/hooks/useBanana';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import useFetchSearch from './hooks/useFetchSearch';
export default function Search() {
  const { onAlbumClick, onPlaylistClick, onTrackClick, onArtistClick, onToggleSaveTrack } = useApi();
  const { query } = useLocalSearchParams();
  const { searchResult, loading, error, savedTracks, imageUrl } = useFetchSearch(query as string);
  if (loading || !searchResult || error || !savedTracks) return null;
  const { topResult, tracks, artists, albums, playlists } = searchResult;

  function handleSave(itemId: string) {
    return onToggleSaveTrack(itemId, !savedTracks.includes(itemId));
  }
  const createTrackItems = () =>
    tracks.map(({ id, name, artists, album }) => ({
      id,
      title: name,
      isSaved: savedTracks.includes(id),
      imageUrl: album.images[0],
      descriptions: [{ text: artists.map(artist => artist.name).join(', ') }],
    }));

  const createArtistItems = () =>
    artists.map(({ id, name, images, followers }) => ({
      id,
      title: name,
      imageUrl: images[0],
      descriptions: [{ text: `${followers} followers` }],
      // descriptions: [{ icon: 'people', text: `${followers} followers` }],
    }));

  const createAlbumItems = () =>
    albums.map(({ id, name, images, total_tracks, release_date }) => ({
      id,
      title: name,
      imageUrl: images[0],
      descriptions: [
        { text: `${release_date.split('-')[0]} - ${total_tracks} tracks` },
        // { text: `${total_tracks} tracks` },
        // { icon: 'musical-notes', text: `${total_tracks} tracks` },
        // { text: release_date.split('-')[0] },
      ],
    }));

  const createPlaylistItems = () =>
    playlists.map(({ id, name, images, total_tracks }) => ({
      id,
      title: name,
      imageUrl: images[0],
      descriptions: [{ text: `${total_tracks} tracks` }],
      // descriptions: [{ icon: 'musical-notes', text: `${total_tracks} tracks` }],
    }));

  return (
    <List
      title={topResult.name}
      image={imageUrl}
      tabs={[
        {
          title: 'Tracks',
          onClick: (itemId: string) => {
            const track = tracks.find(({ id }) => id === itemId);
            if (!track) return;
            onTrackClick(
              itemId,
              track.name,
              track.artists.map(artist => artist.name),
            );
          },
          onSave: handleSave,
          items: createTrackItems(),
        },
        {
          title: 'Artists',
          onClick: onArtistClick,
          items: createArtistItems(),
        },
        {
          title: 'Albums',
          onClick: onAlbumClick,
          items: createAlbumItems(),
        },
        {
          title: 'Playlists',
          onClick: onPlaylistClick,
          items: createPlaylistItems(),
        },
      ]}
    />
  );
}
