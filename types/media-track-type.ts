import { ImageSourcePropType } from 'react-native';

export interface MediaTrackType {
  spotifyId: string;
  title: string;
  artists: string[];
  youtubeId: string;
  description: string;
  image: ImageSourcePropType;
  publish_date: Date;
  file?: string;
  source: 'artist' | 'album' | 'playlist' | 'search' | 'collection';
  sourceId: string;
  nextTrack?: {
    spotifyId: string;
    title: string;
    artists: string[];
    youtubeId?: string;
    description?: string;
    image: ImageSourcePropType;
    publish_date?: Date;
    file?: string;
  };
  prevTrack?: {
    spotifyId: string;
    title: string;
    artists: string[];
    youtubeId?: string;
    description?: string;
    image: ImageSourcePropType;
    publish_date?: Date;
    file?: string;
  };
}
