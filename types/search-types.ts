import { ImageSourcePropType } from "react-native";

export interface SearchAlbumType {
    id: string;
    name: string;
    images: ImageSourcePropType[];
    release_date: string;
    total_tracks: number;
    artists: {
        id: string;
        name: string;
    }[];
}
export interface SearchArtistType {
    id: string;
    name: string;
    followers: number; // 
    genres: string[];
    images: ImageSourcePropType[]; //
    popularity: number;
    score: number;
}
export interface SearchPlaylistType {
    id: string;
    name: string;
    images: ImageSourcePropType[];
    score: number;
    total_tracks: number;
}
export interface SearchTopResultType {
    id: string;
    name: string;
    images: ImageSourcePropType[];
    score: number;
    genres: string[];
    followers: number;
    popularity: number;
    duration_ms?: number;
    artists: {
        id: string;
        name: string;
    }[]
    album?: {
        id: string;
        name: string;
        release_date: string;
        total_tracks: number;
        images: ImageSourcePropType[];
        artists: {
            id: string;
            name: string;
        }[]
    }
    type: 'album' | 'artist' | 'playlist' | 'track';
}
export interface SearchTrackType {
    id: string;
    name: string;
    popularity: number;
    artists: {
        id: string;
        name: string;
    }[];
    score: number;
    album: {
        id: string;
        name: string;
        images: ImageSourcePropType[];
        release_date: string;
        total_tracks: number;
        artists: {
            id: string;
            name: string;
        }[]
    };
}
export interface SearchResultType {
    id: string; //query
    albums: SearchAlbumType[];
    artists: SearchArtistType[];
    playlists: SearchPlaylistType[];
    tracks: SearchTrackType[];
    topResult: SearchTopResultType;
}