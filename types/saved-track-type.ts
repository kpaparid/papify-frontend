import { ImageSourcePropType } from "react-native";

export interface SavedTrackType {
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
            images: ImageSourcePropType[];
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
    youtube: {
        query: string;
        spotifyId: string;
        youtubeId: string;
        title: string;
        publish_date: string;
        images: ImageSourcePropType[];
        description: string;
        _id: string;
    }[];
    _id: string;
}