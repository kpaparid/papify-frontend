import { ImageSourcePropType } from "react-native";

export interface ArtistProfileDetailsType {
    id: string;
    name: string;
    images: ImageSourcePropType[];
    genres: string[];
    followers: number;
    popularity: number;
}
export interface ArtistProfilePlaylistType {
    id: string;
    name: string;
    images: ImageSourcePropType[];
    total_tracks: number;
    description: string;
}
export interface ArtistProfileTopTracksType {
    id: string;
    name: string;
    duration_ms: number;
    popularity: number;
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
    },
    artists: {
        id: string;
        name: string;
    }[]
}
export interface ArtistProfileTracksType {
    id: string;
    name: string;
    duration_ms: number;
    popularity: number;
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
    }[],
    artists: {
        id: string;
        name: string;
    }[]
}
export interface ArtistProfileAlbumsType {
    id: string;
    name: string;
    images: ImageSourcePropType[];
    release_date: string;
    total_tracks: number;
    popularity: number;
    label: string;
    tracks: {
        id: string;
        name: string;
        duration_ms: number;
        artists: {
            id: string;
            name: string;
        }[]
    }[]
    artists: {
        id: string;
        name: string;
    }[]
}
export interface ArtistProfileType {
    id: string;
    artist: ArtistProfileDetailsType;
    playlists: ArtistProfilePlaylistType[];
    topTracks: ArtistProfileTopTracksType[];
    tracks: ArtistProfileTracksType[];
    albums: ArtistProfileAlbumsType[];
}