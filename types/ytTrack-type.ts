import { ImageSourcePropType } from "react-native";

export interface YtTrackType {
    spotifyId: string;
    youtubeId: string;
    title: string;
    publish_date: Date;
    images: ImageSourcePropType[];
    description: string;
    }