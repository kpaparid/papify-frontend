import { CollectionType, TracksCollectionType } from './collection-type';

export interface DeviceAlbumType {
  name: string;
  allIds: string[];
  missingIds: string[];
  byId: { [id: string]: TracksCollectionType };
}
