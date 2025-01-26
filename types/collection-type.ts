import { ImageSourcePropType } from "react-native";

export interface CollectionType {
    name: string;
    tracks: TracksCollectionType[];
}
export interface TracksCollectionType {
    id: string;
    name: string;
    artists: {
        id: string;
        name: string;
    }[];
    query: string;
}