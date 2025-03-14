import { ImageSourcePropType } from "react-native";

export interface CollectionType {
    name: string;
    tracks: TracksCollectionType[];
}
export interface TracksCollectionType {
    id: string;
    name: string;
    images: ImageSourcePropType[]
    artists: {
        id: string;
        name: string;
    }[];
    query: string;
    storage?: {
        storageId: string,
        name: string,
        size: number,
        createdTime: Date,
      },
}