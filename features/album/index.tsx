import useApi from '@/hooks/useBanana';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import List from '../../components/list';
import { useFetchAlbum } from './hooks/useFetchAlbum';

export default function Album() {
  const { id } = useLocalSearchParams();

  const { onTrackClick, onToggleSaveTrack } = useApi();
  const { albumData, savedTracks } = useFetchAlbum(id as string);

  function handleSave(itemId: string) {
    return onToggleSaveTrack(itemId, !savedTracks.includes(itemId));
  }

  if (!albumData) return null;

  return (
    <List
      title={albumData.name}
      subtitle={albumData.artists
        .slice(0, 2)
        .map(artist => artist.name)
        .join(', ')}
      description={[`${albumData.tracks.length} tracks`, albumData.release_date]}
      image={albumData.images[0]}
      tabs={[
        {
          title: "Album's Tracks",
          onClick: (itemId: string) => {
            const track = albumData.tracks.find(({ id }) => id === itemId);
            if (!track) return;
            return onTrackClick(
              itemId,
              track.name,
              track.artists.slice(0, 2).map(artist => artist.name),
              albumData.images[0],
              'album',
              id as string,
            );
          },
          onSave: handleSave,
          items: albumData.tracks.map(({ id, name, artists }) => ({
            id,
            title: name,
            isSaved: savedTracks.includes(id),
            isDownloaded: true,
            descriptions: [
              {
                text: artists
                  .slice(0, 2)
                  .map(artist => artist.name)
                  .join(', '),
              },
            ],
          })),
        },
      ]}
    />
  );
}
