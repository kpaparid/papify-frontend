import List from '@/components/list';
import useApi from '@/hooks/useBanana';
import {
  ArtistProfileAlbumsType,
  ArtistProfileDetailsType,
  ArtistProfilePlaylistType,
  ArtistProfileTracksType,
} from '@/types/artist-type';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useFetchArtist } from './hooks/useFetchArtist';

export default function Artist() {
  const { id } = useLocalSearchParams();
  const { artistData, tracksLoaded, savedTracks } = useFetchArtist(
    id as string,
  );

  const { onAlbumClick, onPlaylistClick, onTrackClick, onToggleSaveTrack } =
    useApi();

  if (!artistData || !tracksLoaded) return null;

  // Render your artist component here
  const {
    tracks,
    albums,
    playlists,
    artist,
  }: {
    tracks: ArtistProfileTracksType[];
    albums: ArtistProfileAlbumsType[];
    playlists: ArtistProfilePlaylistType[];
    artist: ArtistProfileDetailsType;
  } = artistData;

  function onSave(itemId: string) {
    return onToggleSaveTrack(itemId, !savedTracks.includes(itemId));
  }
  return (
    <List
      title={artist.name}
      image={artist.images[0]}
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
          onSave,
          items: tracks.map(({ id, name, artists, album }) => ({
            id,
            title: name,
            isSaved: savedTracks.includes(id),
            imageUrl: album[0].images[0],
            descriptions: [
              { text: artists.map(artist => artist.name).join(', ') },
            ],
          })),
        },
        {
          title: 'Albums',
          onClick: onAlbumClick,
          items: albums.map(
            ({ id, name, images, total_tracks, release_date }) => ({
              id,
              title: name,
              imageUrl: images[0],
              descriptions: [
                {
                  // icon: 'musical-notes',
                  text: `${release_date.split('-')[0]} - ${total_tracks} tracks`,
                  // text: `${total_tracks} tracks, ${release_date.split('-')[0]}`,
                },
                // {
                //   text: release_date.split('-')[0],
                // },
              ],
            }),
          ),
        },
        {
          title: 'Playlists',
          onClick: onPlaylistClick,
          items: playlists.map(({ id, name, images, total_tracks }) => ({
            id,
            title: name,
            imageUrl: images[0],
            descriptions: [
              {
                // icon: 'musical-notes',
                text: `${total_tracks} tracks`,
              },
            ],
          })),
        },
      ]}
    />
  );
}
