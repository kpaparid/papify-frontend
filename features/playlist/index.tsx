import useApi from '@/hooks/useBanana';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import List from '../../components/list';
import { useFetchPlaylist } from './hooks/useFetchPlaylist';

export default function Playlist() {
  const { id } = useLocalSearchParams();

  const { savedTracks, playlistData, tracksLoaded, loading } = useFetchPlaylist(
    id as string,
  );
  const { onTrackClick, onToggleSaveTrack } = useApi();

  function handleSave(itemId: string) {
    return onToggleSaveTrack(itemId, !savedTracks.includes(itemId));
  }

  if (loading || !playlistData || !tracksLoaded) return null;

  return (
    <List
      title={playlistData.name}
      subtitle={playlistData.owner.name}
      description={[playlistData.tracks.length + ' tracks']}
      image={playlistData.images[0]}
      tabs={[
        {
          title: 'Tracks',
          onSave: handleSave,
          onClick: (itemId: string) => {
            const track = playlistData.tracks.find(({ id }) => id === itemId);
            if (!track) return;
            onTrackClick(
              itemId,
              track.name,
              track.artists.map(artist => artist.name),
            );
          },
          items: playlistData.tracks.map(({ id, name, artists }) => ({
            id,
            title: name,
            isSaved: savedTracks.includes(id),
            descriptions: [
              { text: artists.map(artist => artist.name).join(', ') },
            ],
          })),
        },
      ]}
    />
  );
}
