import { ImageSourcePropType } from "react-native";

export interface AlbumType {
    id: string;
    total_tracks: number;
    images: ImageSourcePropType[];
    name: string;
    release_date: string;
    artists: {
        id: string;
        name: string;
    }[]
    tracks: {
        id: string;
        name: string;
        duration_ms: number;
        artists: {
            id: string;
            name: string;
        }[]
    }[]
}