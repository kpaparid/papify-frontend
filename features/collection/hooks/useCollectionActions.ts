import { downloadTrack } from '@/api/callbacks';
import useApi from '@/hooks/useBanana';
import { SavedTrackType } from '@/types/saved-track-type';

export const useCollectionActions = () => {
  const { onTrackClick, onToggleSaveTrack, onCreateCollection, onToggleCollection } = useApi();

  const onDelete = (id: string) => {
   return onToggleSaveTrack(id, false);
  };

  const onDownload = (track: SavedTrackType) => {
    if (!track) return;
   return downloadTrack(track);
  };

  const onClick = (track: SavedTrackType) => {
    if (!track) return;
    onTrackClick(track.id, track.spotify.name, track.spotify.artists.map(artist => artist.name));
  };

  const onToggleCategory = ({ id, category, value }: { id: string, category: string, value: boolean }) => {
    onToggleCollection(id, category, value);
  };

  return { onDelete, onDownload, onTrackClick: onClick, onCreateCollection, onToggleCategory };
};