import { ImageSourcePropType } from "react-native";

export interface PlaylistType {
    id: string;
    name: string;
    images: ImageSourcePropType[];
    owner: {
        name: string;
        id: string;
        type: string;
    }
    total_tracks: number;
    tracks: PlaylistTracksType[];
}
export interface PlaylistTracksType {
    id: string;
    name: string;
    duration_ms: number;
    popularity: number;
    artists: {
        id: string;
        name: string;
    }[];
    album: {
        id: string;
        name: string;
        images: ImageSourcePropType[];
        release_date: string;
        total_tracks: number;
        artists: {
            id: string;
            name: string;
        }[];
    }[]
}