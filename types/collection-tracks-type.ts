export default interface CollectionTracksType {
  tracks: {
    _id: string;
    id: string;
    collectionIds: string[];
    spotify: {
      spotifyId: string;
      album: {
        id: string;
        name: string;
        artists: {
          name: string;
          id: string;
          _id: string;
        }[];
        images: string[];
        release_date: string;
      };
      name: string;
      popularity: number;
      duration_ms: number;
      artists: {
        name: string;
        id: string;
        _id: string;
      }[];
    };
    youtube?: {
      spotifyId: string;
      youtubeId: string;
      title: string;
      publish_date: string;
      images: string[];
      description: string;
      _id: string;
    }[];
    __v: number;
  }[];
  collections: {
    name: string;
    trackIds: string[];
  }[];
}
