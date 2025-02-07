import { downloadTrack, moveFiles } from '@/api/callbacks';
import useApi from '@/hooks/useBanana';
import { SavedTrackType } from '@/types/saved-track-type';
import { useDispatch } from 'react-redux';

export const useCollectionActions = () => {
  const dispatch = useDispatch();
  const { onTrackClick, onToggleSaveTrack, onCreateCollection, onToggleCollection, syncDeviceTracks } = useApi();

  const onDelete = (id: string) => {
   return onToggleSaveTrack(id, false);
  };

  const onDownload = (track: SavedTrackType) => {
    if (!(track && track.id && track?.storage?.name)) return;
  return downloadTrack(track).then(() => syncDeviceTracks());
  };

  const onClick = (track: SavedTrackType) => {
    if (!track) return;
    return onTrackClick(track.id, track.spotify.name, track.spotify.artists.map(artist => artist.name));
  };

  const onToggleCategory = ({ id, category, value }: { id: string, category: string, value: boolean }) => {
    return onToggleCollection(id, category, value);
  };
  const onMoveFiles = (tracks: SavedTrackType[]) => {
    return moveFiles(tracks);
  };

  return { onDelete, onDownload, onTrackClick: onClick, onCreateCollection, onToggleCategory, onMoveFiles };
};